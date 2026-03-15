"use client";

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { 
    TrendingUp, 
    Users, 
    MousePointer2, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight,
    Calendar,
    Loader2
} from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const COLORS = ['#7C8C5C', '#2B2B2B', '#E8DCC8', '#A3B38A', '#8B5CF6', '#F59E0B'];

export default function ReportsPage() {
    const { data: reports, isLoading } = useSWR("/api/admin/reports", fetcher);

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
            </div>
        );
    }

    const { trafficData, revenueGrowth, categorySales, brandSales, summary } = reports || {};

    return (
        <div className="space-y-10 pb-10">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Visits", value: summary?.totalVisits || "0", change: "+12.5%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Conversion Rate", value: summary?.conversionRate || "0%", change: "+2.1%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Total Clicks", value: summary?.totalClicks || "0", change: "-0.4%", icon: MousePointer2, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Avg. Order Value", value: summary?.avgOrderValue || "0", change: "+5.1%", icon: DollarSign, color: "text-[#7C8C5C]", bg: "bg-[#7C8C5C]/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-[#E8DCC8]">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.change.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`}>
                                {stat.change.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-[#999] uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
                        <h3 className="text-2xl font-black text-[#2B2B2B]">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic Analytics */}
                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-[#E8DCC8]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-[#2B2B2B]">Traffic Analytics</h3>
                            <p className="text-xs text-[#999] font-bold mt-1">Weekly visits and click data</p>
                        </div>
                        <select className="bg-[#FAFAF7] border border-[#E8DCC8] rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#7C8C5C] transition-colors">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EAE0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#999" dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#999" />
                                <Tooltip cursor={{fill: '#FAFAF7'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="visits" fill="#7C8C5C" radius={[6, 6, 0, 0]} barSize={32} />
                                <Bar dataKey="clicks" fill="#2B2B2B" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Growth */}
                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-[#E8DCC8]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-[#2B2B2B]">Revenue Growth</h3>
                            <p className="text-xs text-[#999] font-bold mt-1">Monthly performance overview</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#7C8C5C] uppercase tracking-widest bg-[#E8DCC8]/20 px-4 py-2 rounded-xl">
                            <Calendar className="w-3.5 h-3.5" />
                            Jan - Jun 2024
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueGrowth}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C8C5C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7C8C5C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DCC8" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#999" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} stroke="#999" />
                                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#7C8C5C" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales by Category */}
                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-[#E8DCC8] flex flex-col items-center">
                    <h3 className="text-xl font-black text-[#2B2B2B] self-start mb-8">Sales by Category</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categorySales}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {categorySales?.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mt-6">
                        {categorySales?.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#555]">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Brands */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-sm border border-[#E8DCC8]">
                    <h3 className="text-xl font-black text-[#2B2B2B] mb-8">Top Performing Brands</h3>
                    <div className="space-y-6">
                        {brandSales?.map((brand: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-[#2B2B2B] italic uppercase text-sm tracking-widest">{brand.name}</h4>
                                    <p className="text-xs font-black text-[#7C8C5C]">{brand.revenueFormatted}</p>
                                </div>
                                <div className="h-3 w-full bg-[#FAFAF7] rounded-full overflow-hidden border border-[#E8DCC8]/50">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#2B2B2B] to-[#7C8C5C] rounded-full transition-all duration-1000"
                                        style={{ width: `${brand.share}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#999]">
                                    <span>{brand.sales} Orders</span>
                                    <span>{brand.share}% Market Share</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
