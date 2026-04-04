"use client";

import { useState } from "react";
import {
    Search,
    Eye,
    Clock,
    Loader2,
    Trash2,
    ArchiveRestore,
    ChevronLeft,
    ChevronRight,
    Filter
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ConfirmationModal from "@/components/confirmation-modal";

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentTab, setCurrentTab] = useState<"all" | "trash">("all");
    
    // For deleting/restoring
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"delete" | "restore">("delete");
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Build URL query
    const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(currentTab === "trash" && { isDeleted: "true" })
    });

    const { data, error, isLoading, mutate } = useSWR(`/api/admin/orders?${searchParams.toString()}`, fetcher);
    const orders = data?.orders || [];
    const totalPages = data?.pages || 1;

    const handleActionConfirm = async () => {
        if (!selectedOrderId) return;
        setIsActionLoading(true);
        try {
            const res = await fetch(`/api/admin/orders/${selectedOrderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isDeleted: actionType === "delete" }),
            });
            if (res.ok) {
                toast.success(actionType === "delete" ? "Order moved to trash" : "Order restored");
                mutate();
            } else {
                toast.error("Failed to process order");
            }
        } catch (err) {
            toast.error("Error occurred");
        } finally {
            setIsActionLoading(false);
            setIsConfirmOpen(false);
            setSelectedOrderId(null);
        }
    };

    const openConfirmModal = (id: string, type: "delete" | "restore") => {
        setSelectedOrderId(id);
        setActionType(type);
        setIsConfirmOpen(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset page on new search
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-orange-100 text-orange-600 border-orange-200";
            case "confirmed": return "bg-blue-100 text-blue-600 border-blue-200";
            case "shipped": return "bg-indigo-100 text-indigo-600 border-indigo-200";
            case "delivered": return "bg-green-100 text-green-600 border-green-200";
            case "cancelled": return "bg-red-100 text-red-600 border-red-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#2B2B2B] mb-1">Order Management</h1>
                    <p className="text-[#555] font-bold uppercase tracking-widest text-[9px]">Track and process customer orders</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#E8DCC8]">
                    <button 
                        onClick={() => { setCurrentTab("all"); setPage(1); }}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${currentTab === 'all' ? 'bg-[#7C8C5C] text-white shadow-md shadow-[#7C8C5C]/20' : 'text-[#999] hover:text-[#555]'}`}
                    >
                        Active Orders
                    </button>
                    <button 
                        onClick={() => { setCurrentTab("trash"); setPage(1); }}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all gap-2 flex items-center ${currentTab === 'trash' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-[#999] hover:text-red-500'}`}
                    >
                        Trash <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#E8DCC8] flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, phone or order ID..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-16 pr-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                    />
                </div>
                {/* Status Filter Dropdown */}
                <div className="relative w-full md:w-auto min-w-[200px]">
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="w-full appearance-none pl-6 pr-12 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all text-[#555] cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <Filter className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E8DCC8] bg-[#FAFAF7]">
                                <th className="px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Order ID <span className="hidden md:block">& Date</span></th>
                                <th className="px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Customer</th>
                                <th className="px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Items</th>
                                <th className="px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Total Price</th>
                                <th className="px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Status</th>
                                <th className="px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC8]/50">
                            {isLoading ? (
                                <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#7C8C5C] mx-auto" /></td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={6} className="py-20 text-center font-bold text-[#999]">No orders found.</td></tr>
                            ) : orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-[#FAFAF7] transition-colors group">
                                    <td className="px-2 md:px-6 py-4">
                                        <div>
                                            <p className="font-black text-[#2B2B2B] text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#999] uppercase mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 md:px-6 py-4">
                                        <div>
                                            <p className="font-bold text-[#2B2B2B] text-sm">{order.customerName}</p>
                                            <p className="text-[9px] font-black text-[#7C8C5C] uppercase tracking-widest">{order.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-2 md:px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            {order.items.slice(0, 2).map((item: any, idx: number) => (
                                                <p key={idx} className="text-[9px] font-bold text-[#555] leading-tight line-clamp-1">
                                                    {item.quantity}x {item.product.name}
                                                </p>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-[8px] font-black text-[#999] uppercase">+{order.items.length - 2} more</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 md:px-6 py-4">
                                        <p className="font-black text-[#2B2B2B] text-sm">PKR {order.total.toLocaleString()}</p>
                                    </td>
                                    <td className="px-2 md:px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="p-2.5 bg-gray-50 text-[#7C8C5C] rounded-xl hover:bg-[#7C8C5C] hover:text-white transition-all shadow-sm outline-none"
                                                title="View Details"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                            {currentTab === 'trash' ? (
                                                <button 
                                                    onClick={() => openConfirmModal(order.id, 'restore')}
                                                    className="p-2.5 bg-green-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm outline-none"
                                                    title="Restore Order"
                                                >
                                                    <ArchiveRestore className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => openConfirmModal(order.id, 'delete')}
                                                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none"
                                                    title="Move to Trash"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Details */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-[#E8DCC8] bg-[#FAFAF7] flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#999]">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="p-2 bg-white border border-[#E8DCC8] rounded-xl text-[#555] hover:bg-[#7C8C5C] hover:text-white hover:border-[#7C8C5C] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#555] disabled:hover:border-[#E8DCC8] transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="p-2 bg-white border border-[#E8DCC8] rounded-xl text-[#555] hover:bg-[#7C8C5C] hover:text-white hover:border-[#7C8C5C] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#555] disabled:hover:border-[#E8DCC8] transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleActionConfirm}
                title={actionType === "delete" ? "Move to Trash" : "Restore Order"}
                message={actionType === "delete" 
                    ? "Are you sure you want to move this order to the trash? You can restore it later."
                    : "Are you sure you want to restore this order?"}
                confirmText={actionType === "delete" ? "Move to Trash" : "Restore"}
                confirmVariant={actionType === "delete" ? "danger" : "primary"}
                loading={isActionLoading}
            />
        </div>
    );
}
