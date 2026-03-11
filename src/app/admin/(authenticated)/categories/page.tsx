"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Loader2,
    FolderTree,
    Save,
    X,
    AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCat, setNewCat] = useState({ name: "", slug: "", icon: "" });
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            toast.error("Error loading categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCat),
            });
            if (res.ok) {
                toast.success("Category added!");
                setNewCat({ name: "", slug: "", icon: "" });
                setIsAdding(false);
                fetchCategories();
            } else {
                toast.error("Failed to add category");
            }
        } catch (err) {
            toast.error("Error occurred");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#2B2B2B] mb-2">Category Structure</h1>
                    <p className="text-[#555] font-bold uppercase tracking-widest text-[10px]">Divide your sneakers into collections</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#7C8C5C] hover:bg-[#5D6B44] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-3"
                    >
                        <Plus className="w-4 h-4" />
                        New Category
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* List Section */}
                <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFAF7] border-b border-[#E8DCC8]">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#555]">Category Name</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#555]">Slug</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#555] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8DCC8]/50">
                                {loading ? (
                                    <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#7C8C5C] mx-auto" /></td></tr>
                                ) : categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-[#FAFAF7] transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#F5EBDC] rounded-xl flex items-center justify-center text-[#7C8C5C] shadow-sm">
                                                    <FolderTree className="w-5 h-5" />
                                                </div>
                                                <p className="font-bold text-[#2B2B2B]">{cat.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-black text-[#999] uppercase tracking-widest">{cat.slug}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Sidebar */}
                <div className="space-y-6">
                    {isAdding ? (
                        <div className="bg-[#2B2B2B] p-10 rounded-[40px] shadow-2xl text-white space-y-8 sticky top-32">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black">Add New Category</h3>
                                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleAddCategory} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCat.name}
                                        onChange={(e) => setNewCat({ ...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                                        className="w-full px-6 py-4 bg-white/10 border-2 border-white/10 rounded-2xl focus:border-[#7C8C5C] outline-none font-bold"
                                        placeholder="e.g. Performance Running"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCat.slug}
                                        className="w-full px-6 py-4 bg-white/10 border-2 border-white/10 rounded-2xl outline-none font-bold text-gray-500"
                                        placeholder="e.g. performance-running"
                                        readOnly
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#7C8C5C] hover:bg-[#A3B38A] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Category
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8] flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-[#F5EBDC] rounded-full flex items-center justify-center text-[#7C8C5C]">
                                <FolderTree className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#2B2B2B] mb-2">Organize Items</h3>
                                <p className="text-xs font-bold text-[#555] uppercase tracking-widest leading-relaxed">
                                    Group your products into meaningful categories to help customers find their perfect fit faster.
                                </p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-2xl flex items-start gap-4 border border-orange-100 text-left">
                                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-relaxed">
                                    Categories define the main navigation of your shop. Choose descriptive names.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
