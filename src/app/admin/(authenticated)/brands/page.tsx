"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    Loader2,
    Tag,
    Save,
    X,
    AlertCircle,
    Image as ImageIcon,
    Edit3
} from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "@/components/confirmation-modal";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function AdminBrandsPage() {
    const { data: brands = [], error, isLoading, mutate } = useSWR<any[]>("/api/admin/brands", fetcher);
    const [isAdding, setIsAdding] = useState(false);
    const [newBrand, setNewBrand] = useState({ name: "", slug: "", icon: "" });
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<string | null>(null);

    const handleEditClick = (brand: any) => {
        setEditingId(brand.id);
        setNewBrand({ name: brand.name, slug: brand.slug, icon: brand.icon || "" });
        setIsAdding(true);
    };

    const handleAddBrand = async () => {
        setSaving(true);
        try {
            const url = editingId ? `/api/admin/brands/${editingId}` : "/api/admin/brands";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBrand),
            });
            if (res.ok) {
                toast.success(editingId ? "Brand updated!" : "Brand added!");
                resetForm();
                mutate();
            } else {
                toast.error("Failed to save brand");
            }
        } catch (err) {
            toast.error("Error occurred");
        } finally {
            setSaving(false);
            setIsConfirmOpen(false);
        }
    };

    const resetForm = () => {
        setNewBrand({ name: "", slug: "", icon: "" });
        setIsAdding(false);
        setEditingId(null);
    };

    const confirmSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    const deleteBrand = async (id: string) => {
        setBrandToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!brandToDelete) return;
        try {
            const res = await fetch(`/api/admin/brands/${brandToDelete}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Brand deleted");
                mutate();
            } else {
                toast.error("Failed to delete brand");
            }
        } catch (err) {
            toast.error("Error deleting brand");
        } finally {
            setIsDeleteConfirmOpen(false);
            setBrandToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-[#2B2B2B] mb-1">Brand Management</h1>
                    <p className="text-[#555] font-bold uppercase tracking-widest text-[9px]">Curate your sneaker labels</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#7C8C5C] hover:bg-[#5D6B44] text-white px-3 md:px-6 py-2 md:py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Brand
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
                                    <th className="px-2 md:px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[#555]">Brand Details</th>
                                    <th className="px-2 md:px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[#555]">Products</th>
                                    <th className="px-2 md:px-2 md:px-6 py-4 text-[9px] font-black uppercase tracking-widest text-[#555] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8DCC8]/50">
                                {isLoading && brands.length === 0 ? (
                                    <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#7C8C5C] mx-auto" /></td></tr>
                                ) : brands.map(brand => (
                                    <tr key={brand.id} className="hover:bg-[#FAFAF7] transition-colors group">
                                        <td className="px-2 md:px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#F5EBDC] rounded-xl flex items-center justify-center overflow-hidden shadow-inner border border-white/40 group-hover:bg-white transition-all duration-500">
                                                    {brand.icon ? (
                                                        <img src={brand.icon} alt={brand.name} className="w-full h-full object-contain p-2" />
                                                    ) : (
                                                        <span className="font-black text-[#7C8C5C] uppercase text-xs">{brand.name[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#2B2B2B] text-base">{brand.name}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{brand.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className=" md:px-6 py-4">
                                            <div className="inline-flex px-2.5 py-1 bg-[#FAFAF7] border border-[#E8DCC8] rounded-full">
                                                <span className="text-[9px] font-black text-[#7C8C5C] uppercase tracking-widest">{brand._count?.products || 0} Items</span>
                                            </div>
                                        </td>
                                        <td className="px-2 md:px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 ">
                                                <button
                                                    onClick={() => handleEditClick(brand)}
                                                    className="p-2.5 text-[#7C8C5C] hover:bg-[#7C8C5C]/10 rounded-xl transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => deleteBrand(brand.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all">
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
                        <div className="bg-[#2B2B2B] p-8 rounded-[32px] shadow-2xl text-white space-y-6 sticky top-32 border border-white/5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black">{editingId ? "Refine Brand" : "Design Brand"}</h3>
                                <button onClick={resetForm} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={confirmSave} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Brand Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newBrand.name}
                                        onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                                        className="w-full px-5 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#7C8C5C] outline-none font-bold transition-all text-sm text-white placeholder:text-gray-600"
                                        placeholder="e.g. Nike"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Icon/Logo URL</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newBrand.icon}
                                            onChange={(e) => setNewBrand({ ...newBrand, icon: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#7C8C5C] outline-none font-bold transition-all text-sm text-white placeholder:text-gray-600"
                                            placeholder="Paste image URL here"
                                        />
                                        <ImageIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    </div>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-4">PNG preferred (transparent)</p>
                                </div>

                                {newBrand.icon && (
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center gap-3">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Preview</p>
                                        <div className="w-16 h-16 bg-white rounded-xl p-3 shadow-2xl">
                                            <img src={newBrand.icon} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#7C8C5C] hover:bg-[#A3B38A] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    {editingId ? "Update Heritage" : "Craft Brand"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#E8DCC8] flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-[#F5EBDC] rounded-full flex items-center justify-center text-[#7C8C5C] shadow-inner">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#2B2B2B] mb-2">Heritage Management</h3>
                                <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest leading-relaxed">
                                    Curate the world's iconic sneaker brands. Your collection starts with a powerful legacy.
                                </p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-[24px] flex items-start gap-3 border border-orange-100 text-left">
                                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <p className="text-[9px] font-black text-orange-600 uppercase tracking-[0.1em] leading-relaxed">
                                    Brand logos are used globally across product cards to enhance visual authentication.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleAddBrand}
                title={editingId ? "Update Heritage?" : "Add New Brand?"}
                message={editingId
                    ? `You are about to update the details for ${newBrand.name}. This is a global change.`
                    : `This will add ${newBrand.name} to your official brand directory.`}
                confirmText={editingId ? "Apply Changes" : "Create Brand"}
                loading={saving}
            />

            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Deconstruct Brand?"
                message="Are you sure? This label will be removed from all associated products. This action is permanent."
                confirmText="Delete Lifetime"
                confirmVariant="danger"
            />
        </div>
    );
}
