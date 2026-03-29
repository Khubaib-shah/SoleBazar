"use client";

import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Search,
    Eye,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function AdminOrdersPage() {
    const { data: orders = [], error, isLoading, mutate } = useSWR<any[]>("/api/admin/orders", fetcher);
    const [searchQuery, setSearchQuery] = useState("");

    const updateStatus = async (id: string, status: string) => {
        try {
            // API call to update status (to be implemented)
            toast.success(`Status updated to ${status}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const filteredOrders = orders.filter(o =>
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.phone.includes(searchQuery) ||
        o.id.includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-orange-100 text-orange-600 border-orange-200";
            case "confirmed": return "bg-blue-100 text-blue-600 border-blue-200";
            case "delivered": return "bg-green-100 text-green-600 border-green-200";
            case "cancelled": return "bg-red-100 text-red-600 border-red-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-[#2B2B2B] mb-1">Order Management</h1>
                <p className="text-[#555] font-bold uppercase tracking-widest text-[9px]">Track and process customer orders</p>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#E8DCC8] flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, phone or order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                    />
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
                            {isLoading && orders.length === 0 ? (
                                <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#7C8C5C] mx-auto" /></td></tr>
                            ) : filteredOrders.map((order) => (
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
                                            {order.items.map((item: any, idx: number) => (
                                                <p key={idx} className="text-[9px] font-bold text-[#555] leading-tight line-clamp-1">
                                                    {item.quantity}x {item.product.name} ({item.size})
                                                </p>
                                            ))}
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
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                            <button className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm outline-none">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
