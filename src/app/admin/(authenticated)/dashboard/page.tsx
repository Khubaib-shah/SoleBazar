"use client";

import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Box,
    Tag,
    TrendingUp,
    Users,
    DollarSign,
    ArrowRight,
    Loader2,
    Clock
} from "lucide-react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface Order {
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}

interface Stats {
    productCount: number;
    orderCount: number;
    brandCount: number;
    categoryCount: number;
    recentOrders: Order[];
    totalRevenue: number;
}

export default function DashboardPage() {
    const { data: stats, error, isLoading } = useSWR<Stats>("/api/admin/stats", fetcher);

    if (isLoading && !stats) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
            </div>
        );
    }

    const statCards = [
        { name: "Total Revenue", value: `PKR ${stats?.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-500", text: "text-green-500" },
        { name: "Orders", value: stats?.orderCount || 0, icon: ShoppingBag, color: "bg-blue-500", text: "text-blue-500" },
        { name: "Products", value: stats?.productCount || 0, icon: Box, color: "bg-[#7C8C5C]", text: "text-[#7C8C5C]" },
        { name: "Brands", value: stats?.brandCount || 0, icon: Tag, color: "bg-purple-500", text: "text-purple-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-[32px] shadow-sm border border-[#E8DCC8] hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center ${stat.text}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="p-1.5 bg-green-50 text-green-500 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-2.5 h-2.5" />
                                +12%
                            </div>
                        </div>
                        <p className="text-[9px] font-black text-[#555] uppercase tracking-widest mb-1.5">{stat.name}</p>
                        <h3 className="text-2xl font-black text-[#2B2B2B]">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#E8DCC8]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-[#2B2B2B]">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-[#7C8C5C] flex items-center gap-2">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3.5 bg-[#FAFAF7] rounded-2xl border border-[#E8DCC8]/50 hover:border-[#7C8C5C] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[9px] text-[#555] shadow-sm">
                                            #{order.id.slice(-4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#2B2B2B] text-sm">{order.customerName}</p>
                                            <div className="flex items-center gap-1.5 text-[9px] text-[#555] font-black uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-[#2B2B2B] text-sm">PKR {order.total.toLocaleString()}</p>
                                        <span className="text-[8px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-[#555] font-bold">No recent orders yet.</p>
                        </div>
                    )}
                </div>

                {/* Revenue Overview */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#E8DCC8]">
                    <h3 className="text-lg font-black text-[#2B2B2B] mb-8">Revenue Overview</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Mon', total: 4000 },
                                { name: 'Tue', total: 3000 },
                                { name: 'Wed', total: 2000 },
                                { name: 'Thu', total: 2780 },
                                { name: 'Fri', total: 1890 },
                                { name: 'Sat', total: 2390 },
                                { name: 'Sun', total: 3490 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C8C5C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7C8C5C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DCC8" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#999" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#999" />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="total" stroke="#7C8C5C" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
