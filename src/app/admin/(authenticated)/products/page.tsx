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

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/products");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            toast.error("Error loading products");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Product deleted successfully");
                fetchProducts();
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#2B2B2B] mb-2">Product Inventory</h1>
                    <p className="text-[#555] font-bold uppercase tracking-widest text-[10px]">Manage your sneaker collection</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-[#7C8C5C] hover:bg-[#5D6B44] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-3 transition-all transform hover:scale-105"
                >
                    <Plus className="w-4 h-4" />
                    Add New Product
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
            <div className="bg-white rounded-[40px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#E8DCC8] bg-[#FAFAF7]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Product Info</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Brand / Category</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Price</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Stock</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Featured / Top</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8DCC8]/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#7C8C5C] mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#FAFAF7] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-20 bg-[#F5EBDC] rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                                                    <img
                                                        src={product.images?.[0]?.url || "/placeholder.svg"}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#2B2B2B] text-sm group-hover:text-[#7C8C5C] transition-colors">{product.name}</p>
                                                    <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest mt-1">Slug: {product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <span className="bg-[#E8DCC8]/30 px-3 py-1 rounded-full text-[10px] font-black text-[#7C8C5C] uppercase tracking-widest">
                                                    {product.brand.name}
                                                </span>
                                                <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest px-1">{product.category.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-[#2B2B2B]">PKR {product.price.toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <p className="font-bold text-sm text-[#2B2B2B]">{product.stock} Units</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    {product.featured ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-gray-300" />
                                                    )}
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 line-clamp-1">Featured</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {product.isTopPick ? (
                                                        <CheckCircle className="w-4 h-4 text-orange-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-gray-300" />
                                                    )}
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 line-clamp-1">Top Pick</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    target="_blank"
                                                    className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-[#7C8C5C] hover:text-white transition-all"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
