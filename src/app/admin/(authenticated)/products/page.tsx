"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { ProductWithRelations } from "@/lib/types";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function AdminProductsPage() {
    const { data: products = [], error, isLoading, mutate } = useSWR<ProductWithRelations[]>("/api/admin/products", fetcher);
    const [searchQuery, setSearchQuery] = useState("");

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Product deleted successfully");
                mutate();
            } else {
                toast.error("Failed to delete product");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#2B2B2B] mb-1">Product Inventory</h1>
                    <p className="text-[#555] font-bold uppercase tracking-widest text-[9px]">Manage your sneaker collection</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-[#7C8C5C] hover:bg-[#5D6B44] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Global Search & Filters */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#E8DCC8] flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, brand or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[32px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E8DCC8] bg-[#FAFAF7]">
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Product Info</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Brand / Category</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Gender</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Price</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Stock</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555]">Featured / Top</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#555] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC8]/50">
                            {isLoading && products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#7C8C5C] mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#FAFAF7] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-16 bg-[#F5EBDC] rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                                    <img
                                                        src={product.images?.[0]?.url || "/placeholder.svg"}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#2B2B2B] text-sm group-hover:text-[#7C8C5C] transition-colors">{product.name}</p>
                                                    <p className="text-[9px] font-bold text-[#999] uppercase tracking-widest mt-0.5">Slug: {product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <span className="bg-[#E8DCC8]/30 px-2.5 py-1 rounded-full text-[9px] font-black text-[#7C8C5C] uppercase tracking-widest">
                                                    {product.brand.name}
                                                </span>
                                                <p className="text-[9px] font-bold text-[#555] uppercase tracking-widest px-1">{product.category.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-[#7C8C5C]/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[#7C8C5C] uppercase tracking-widest">
                                                {product.gender}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-black text-[#2B2B2B] text-sm">PKR {product.price.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <p className="font-bold text-xs text-[#2B2B2B]">{product.stock} Units</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    {product.featured ? (
                                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-3.5 h-3.5 text-gray-300" />
                                                    )}
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 line-clamp-1">Featured</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {product.isTopPick ? (
                                                        <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                                                    ) : (
                                                        <XCircle className="w-3.5 h-3.5 text-gray-300" />
                                                    )}
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 line-clamp-1">Top Pick</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1.5 text-right">
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    target="_blank"
                                                    className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all outline-none"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-[#7C8C5C] hover:text-white transition-all outline-none"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all outline-none"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <p className="text-[#555] font-black uppercase tracking-widest">No products found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-8 py-6 border-t border-[#E8DCC8] flex items-center justify-between bg-[#FAFAF7]">
                    <p className="text-[10px] font-black text-[#999] uppercase tracking-widest">
                        Showing {filteredProducts.length} Results
                    </p>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white border border-[#E8DCC8] rounded-xl text-[#999] cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-3 bg-white border border-[#E8DCC8] rounded-xl text-[#999] cursor-not-allowed">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
