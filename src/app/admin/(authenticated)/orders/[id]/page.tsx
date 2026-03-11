"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    ShoppingBag,
    User,
    Phone,
    MapPin,
    Clock,
    Package,
    CheckCircle2,
    XCircle,
    Loader2,
    Printer,
    ChevronRight,
    RefreshCcw,
    ExternalLink,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/orders/${id}`);
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            setOrder(data);
        } catch (err) {
            toast.error("Order not found");
            router.push("/admin/orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchOrder();
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            toast.error("Error occurred");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
            </div>
        );
    }

    const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/orders"
                    className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-[#7C8C5C] hover:text-[#5D6B44] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Link>
                <div className="flex gap-4">
                    <button className="p-4 bg-white border border-[#E8DCC8] rounded-2xl text-[#2B2B2B] hover:bg-[#FAFAF7] transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-sm">
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Order Header */}
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8] flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#999] mb-2">Order Information</p>
                            <h1 className="text-3xl font-black text-[#2B2B2B]">Order #{order.id.slice(-6).toUpperCase()}</h1>
                            <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-[#555] uppercase tracking-widest">
                                <Clock className="w-4 h-4" />
                                Placed on {new Date(order.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 flex items-center gap-2 ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                    order.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                        'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                {order.status}
                                {updating && <Loader2 className="w-3 h-3 animate-spin" />}
                            </span>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                        <div className="p-10 border-b border-[#E8DCC8]">
                            <h3 className="text-xl font-black text-[#2B2B2B]">Order Items</h3>
                        </div>
                        <div className="divide-y divide-[#E8DCC8]/50">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-10 flex flex-col md:flex-row items-center gap-8 group">
                                    <div className="w-24 h-32 bg-[#F5EBDC] rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                                        <img
                                            src={item.product.images?.[0]?.url || "/placeholder.svg"}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <p className="text-[10px] font-black text-[#7C8C5C] uppercase tracking-widest">{item.product.brand.name}</p>
                                        <h4 className="font-black text-[#2B2B2B] text-lg">{item.product.name}</h4>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                            <div className="bg-[#FAFAF7] px-4 py-1.5 rounded-full border border-[#E8DCC8] text-[10px] font-bold uppercase tracking-widest text-[#555]">
                                                Size: {item.size || 'N/A'}
                                            </div>
                                            <div className="bg-[#FAFAF7] px-4 py-1.5 rounded-full border border-[#E8DCC8] text-[10px] font-bold uppercase tracking-widest text-[#555]">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-[#999] uppercase tracking-widest mb-1">Price</p>
                                        <p className="text-xl font-black text-[#2B2B2B]">PKR {item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="p-10 bg-[#FAFAF7] flex justify-between items-center">
                                <p className="font-black text-[#2B2B2B] uppercase tracking-widest text-lg">Total Amount</p>
                                <p className="text-3xl font-black text-[#7C8C5C]">PKR {order.total.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Status Update Widget */}
                    <div className="bg-[#2B2B2B] p-10 rounded-[40px] shadow-2xl text-white space-y-8">
                        <h3 className="text-xl font-black flex items-center gap-3">
                            <RefreshCcw className="w-5 h-5 text-[#7C8C5C]" />
                            Update Status
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {statusOptions.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => updateStatus(status)}
                                    disabled={updating || order.status === status}
                                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${order.status === status
                                            ? "bg-[#7C8C5C] text-white shadow-lg shadow-[#7C8C5C]/20 border-2 border-[#7C8C5C]"
                                            : "bg-white/5 border-2 border-white/5 hover:border-white/20 text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-8">
                        <h3 className="text-xl font-black text-[#2B2B2B]">Customer Details</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#F5EBDC] rounded-xl flex items-center justify-center text-[#7C8C5C] flex-shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#999] uppercase tracking-widest mb-1">Name</p>
                                    <p className="font-bold text-[#2B2B2B]">{order.customerName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#F5EBDC] rounded-xl flex items-center justify-center text-[#7C8C5C] flex-shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#999] uppercase tracking-widest mb-1">Phone</p>
                                    <p className="font-bold text-[#2B2B2B]">{order.phone}</p>
                                    <a
                                        href={`https://wa.me/${order.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        className="text-[10px] font-black text-[#7C8C5C] uppercase tracking-wider flex items-center gap-1 mt-1 hover:underline"
                                    >
                                        <ExternalLink className="w-3 h-3" /> Chat on WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 border-t border-[#E8DCC8] pt-6">
                                <div className="w-10 h-10 bg-[#F5EBDC] rounded-xl flex items-center justify-center text-[#7C8C5C] flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#999] uppercase tracking-widest mb-1">Shipping Address</p>
                                    <p className="font-bold text-[#2B2B2B] leading-relaxed">{order.address || "No address provided"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
