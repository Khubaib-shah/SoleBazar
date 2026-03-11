"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Loader2,
    FolderTree,
    Save,
    X,
    AlertCircle,
    Edit3
} from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "@/components/confirmation-modal";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function AdminCategoriesPage() {
    const { data: categories = [], error, isLoading, mutate } = useSWR<any[]>("/api/admin/categories", fetcher);
    const [isAdding, setIsAdding] = useState(false);
    const [newCat, setNewCat] = useState({ name: "", slug: "", icon: "" });
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [catToDelete, setCatToDelete] = useState<string | null>(null);

    const handleEditClick = (cat: any) => {
        setEditingId(cat.id);
        setNewCat({ name: cat.name, slug: cat.slug, icon: cat.icon || "" });
        setIsAdding(true);
    };

    const handleAddCategory = async () => {
        setSaving(true);
        try {
            const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCat),
            });
            if (res.ok) {
                toast.success(editingId ? "Category updated!" : "Category added!");
                resetForm();
                mutate();
            } else {
                toast.error("Failed to save category");
            }
        } catch (err) {
            toast.error("Error occurred");
        } finally {
            setSaving(false);
            setIsConfirmOpen(false);
        }
    };

    const resetForm = () => {
        setNewCat({ name: "", slug: "", icon: "" });
        setIsAdding(false);
        setEditingId(null);
    };

    const confirmSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const deleteCategory = (id: string) => {
        setCatToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!catToDelete) return;
        try {
            const res = await fetch(`/api/admin/categories/${catToDelete}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Category deleted");
                mutate();
            } else {
                toast.error("Failed to delete category");
            }
        } catch (err) {
            toast.error("Error deleting category");
        } finally {
            setIsDeleteConfirmOpen(false);
            setCatToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#2B2B2B] mb-1">Category Structure</h1>
                    <p className="text-[#555] font-bold uppercase tracking-widest text-[9px]">Divide your sneakers into collections</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#7C8C5C] hover:bg-[#5D6B44] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Category
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-[#E8DCC8] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFAF7] border-b border-[#E8DCC8]">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[#555]">Category Name</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[#555]">Slug</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[#555] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8DCC8]/50">
                                {isLoading && categories.length === 0 ? (
                                    <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#7C8C5C] mx-auto" /></td></tr>
                                ) : categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-[#FAFAF7] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#F5EBDC] rounded-xl flex items-center justify-center text-[#7C8C5C] shadow-sm group-hover:bg-white transition-colors duration-500">
                                                    <FolderTree className="w-4 h-4" />
                                                </div>
                                                <p className="font-bold text-[#2B2B2B] text-sm">{cat.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[9px] font-black text-[#999] uppercase tracking-widest">{cat.slug}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(cat)}
                                                    className="p-2.5 text-[#7C8C5C] hover:bg-[#7C8C5C]/10 rounded-xl transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCategory(cat.id)}
                                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
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

                {/* Add/Edit Sidebar */}
                <div className="space-y-6">
                    {isAdding ? (
                        <div className="bg-[#2B2B2B] p-8 rounded-[32px] shadow-2xl text-white space-y-6 sticky top-24 border border-white/5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black">{editingId ? "Refine Collection" : "Add New Category"}</h3>
                                <button onClick={resetForm} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={confirmSave} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCat.name}
                                        onChange={(e) => setNewCat({ ...newCat, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                                        className="w-full px-5 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#7C8C5C] outline-none font-bold text-sm transition-all text-white placeholder:text-gray-600"
                                        placeholder="Performance Running"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCat.slug}
                                        className="w-full px-5 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl outline-none font-bold text-sm text-gray-500"
                                        placeholder="performance-running"
                                        readOnly
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#7C8C5C] hover:bg-[#A3B38A] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    {editingId ? "Update Section" : "Save Category"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#E8DCC8] flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-[#F5EBDC] rounded-full flex items-center justify-center text-[#7C8C5C] shadow-inner">
                                <FolderTree className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#2B2B2B] mb-2">Organize Items</h3>
                                <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest leading-relaxed">
                                    Group your products into meaningful categories to help customers find their perfect fit faster.
                                </p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-[24px] flex items-start gap-3 border border-orange-100 text-left">
                                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <p className="text-[9px] font-black text-orange-600 uppercase tracking-[0.1em] leading-relaxed">
                                    Categories define the main navigation of your shop. Choose descriptive names.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleAddCategory}
                title={editingId ? "Update Category?" : "Create Category?"}
                message={editingId
                    ? `You are about to reclassify items in the ${newCat.name} collection. This affects the site menu.`
                    : `This will introduce the ${newCat.name} category to your store's architecture.`}
                confirmText={editingId ? "Modify Structure" : "Establish Category"}
                loading={saving}
            />

            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Deconstruct Category?"
                message="Are you sure? This collection link will be severed. Products will remain but will be uncategorized."
                confirmText="Archive Forever"
                confirmVariant="danger"
            />
        </div>
    );
}
