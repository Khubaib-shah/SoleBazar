"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF7] flex">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#2B2B2B] text-white transition-all duration-500 flex flex-col fixed h-screen z-50`}>
                <div className="p-8 flex items-center justify-between">
                    <Link href="/" className={`font-black text-xl transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        SOLE<span className="text-[#7C8C5C]">BAZAR</span>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>

                <nav className="flex-1 px-4 mt-10 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-3 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive
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
                <header className="h-24 bg-white border-b border-[#E8DCC8] flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-[#2B2B2B] capitalize">
                            {pathname.split('/').pop()?.replace('-', ' ')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-[#2B2B2B]">{session.user?.name}</p>
                            <p className="text-[10px] font-bold text-[#7C8C5C] uppercase tracking-[0.2em]">Authorized Admin</p>
                        </div>
                        <div className="w-12 h-12 bg-[#F5EBDC] rounded-2xl flex items-center justify-center font-black text-[#7C8C5C] border border-[#E8DCC8]">
                            {session.user?.name?.[0]}
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
