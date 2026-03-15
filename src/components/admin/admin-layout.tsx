"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    BarChart2,
    Settings,
    LayoutDashboard,
    Box,
    ShoppingBag,
    Tag,
    FolderTree,
    LogOut,
    ChevronRight,
    Menu,
    X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { getInitials } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings();
    const siteName = settings?.siteName || "SoleBazar";
    const initials = getInitials(siteName);
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
    }, [status, router]);

    if (status === "loading" || !session) {
        return (
            <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#7C8C5C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: Box },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Brands", href: "/admin/brands", icon: Tag },
        { name: "Categories", href: "/admin/categories", icon: FolderTree },
        { name: "Reports", href: "/admin/reports", icon: BarChart2 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF7] flex">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#2B2B2B] text-white transition-all duration-500 flex flex-col fixed h-screen z-50`}>
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="font-black text-xl transition-all duration-300 flex items-center gap-2">
                        <span className={`bg-[#7C8C5C] text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${isSidebarOpen ? 'scale-100' : 'scale-110'}`}>
                            {initials}
                        </span>
                        <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            {siteName}
                        </span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>

                <nav className="flex-1 px-4 mt-10 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-[14px] py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive
                                    ? "bg-[#7C8C5C] text-white shadow-lg"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                    {item.name}
                                </span>
                                {isActive && isSidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'pl-72' : 'pl-20'}`}>
                <header className="h-16 bg-white border-b border-[#E8DCC8] flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-black text-[#2B2B2B] capitalize">
                            {pathname.split('/').pop()?.replace('-', ' ')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-[#2B2B2B]">{session.user?.name}</p>
                            <p className="text-[9px] font-bold text-[#7C8C5C] uppercase tracking-[0.2em]">Authorized Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-[#F5EBDC] rounded-xl flex items-center justify-center font-black text-[#7C8C5C] border border-[#E8DCC8]">
                            {session.user?.name?.[0]}
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
