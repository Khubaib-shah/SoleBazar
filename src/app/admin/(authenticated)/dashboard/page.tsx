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

interface Stats {
    productCount: number;
    orderCount: number;
    brandCount: number;
    categoryCount: number;
    recentOrders: any[];
    totalRevenue: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
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
        <div className="space-y-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white p-8 rounded-[40px] shadow-sm border border-[#E8DCC8] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`w-14 h-14 ${stat.color} bg-opacity-10 rounded-2xl flex items-center justify-center ${stat.text}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="p-2 bg-green-50 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +12%
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-2">{stat.name}</p>
                        <h3 className="text-3xl font-black text-[#2B2B2B]">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Orders */}
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8]">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-[#2B2B2B]">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-xs font-black uppercase tracking-widest text-[#7C8C5C] flex items-center gap-2">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="space-y-6">
                            {stats.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-[#FAFAF7] rounded-3xl border border-[#E8DCC8]/50 hover:border-[#7C8C5C] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-[10px] text-[#555] shadow-sm">
                                            #{order.id.slice(-4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#2B2B2B]">{order.customerName}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-[#555] font-black uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-[#2B2B2B]">PKR {order.total.toLocaleString()}</p>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
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

                {/* Revenue Overview (Placeholder data for chart) */}
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8]">
                    <h3 className="text-xl font-black text-[#2B2B2B] mb-10">Revenue Overview</h3>
                    <div className="h-80">
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
