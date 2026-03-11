"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState<any>({
        name: "",
        slug: "",
        description: "",
        price: 0,
        compareAt: "",
        condition: "New",
        sizes: [],
        colors: [],
        stock: 1,
        featured: false,
        isTopPick: false,
        brandId: "",
        categoryId: "",
    });

    const [images, setImages] = useState<any[]>([]);
    const [newSize, setNewSize] = useState("");
    const [newColor, setNewColor] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsRes, categoriesRes, productRes] = await Promise.all([
                    fetch("/api/admin/brands"),
                    fetch("/api/admin/categories"),
                    fetch(`/api/admin/products/${id}`)
                ]);

                const b = await brandsRes.json();
                const c = await categoriesRes.json();
                const p = await productRes.json();

                setBrands(b);
                setCategories(c);

                setFormData({
                    ...p,
                    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes || "[]") : (p.sizes || []),
                    colors: typeof p.colors === 'string' ? JSON.parse(p.colors || "[]") : (p.colors || []),
                    compareAt: p.compareAt || "",
                    isTopPick: p.isTopPick || false,
                });
                setImages(p.images || []);
            } catch (err) {
                toast.error("Error loading product data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e: any) => {
        const { name, value, type } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value
        }));
    };

    const handleAddSize = () => {
        if (newSize && !formData.sizes.includes(newSize)) {
            setFormData((prev: any) => ({ ...prev, sizes: [...prev.sizes, newSize] }));
            setNewSize("");
        }
    };

    const handleRemoveSize = (size: string) => {
        setFormData((prev: any) => ({ ...prev, sizes: prev.sizes.filter((s: string) => s !== size) }));
    };

    const handleAddColor = () => {
        if (newColor && !formData.colors.includes(newColor)) {
            setFormData((prev: any) => ({ ...prev, colors: [...prev.colors, newColor] }));
            setNewColor("");
        }
    };

    const handleRemoveColor = (color: string) => {
        setFormData((prev: any) => ({ ...prev, colors: prev.colors.filter((c: string) => c !== color) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images
                }),
            });

            if (res.ok) {
                toast.success("Product updated!");
                router.push("/admin/products");
            } else {
                toast.error("Failed to update product");
            }
        } catch (err) {
            toast.error("Error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <Link href="/admin/products" className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-[#7C8C5C] hover:text-[#5D6B44]">
                    <ArrowLeft className="w-4 h-4" /> Back to Products
                </Link>
                <h1 className="text-3xl font-black text-[#2B2B2B]">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-8">
                            <h3 className="text-xl font-black text-[#2B2B2B]">Product Essence</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Full Description</label>
                                    <textarea
                                        name="description"
                                        rows={6}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8] grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-[#2B2B2B]">Sizes</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add size"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        className="flex-1 px-6 py-3 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSize}
                                        className="w-12 h-12 bg-[#2B2B2B] text-white rounded-2xl flex items-center justify-center hover:bg-[#1a1a1a]"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.sizes.map((s: string) => (
                                        <span key={s} className="px-4 py-2 bg-[#F5EBDC] text-[#2B2B2B] font-black text-xs rounded-xl flex items-center gap-2">
                                            {s} <button type="button" onClick={() => handleRemoveSize(s)} className="text-red-500 hover:text-red-700">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-[#2B2B2B]">Colors</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add color"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        className="flex-1 px-6 py-3 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddColor}
                                        className="w-12 h-12 bg-[#2B2B2B] text-white rounded-2xl flex items-center justify-center hover:bg-[#1a1a1a]"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.colors.map((c: string) => (
                                        <span key={c} className="px-4 py-2 bg-[#F5EBDC] text-[#2B2B2B] font-black text-xs rounded-xl flex items-center gap-2">
                                            {c} <button type="button" onClick={() => handleRemoveColor(c)} className="text-red-500 hover:text-red-700">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-8">
                            <h3 className="text-xl font-black text-[#2B2B2B]">Visual Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#E8DCC8]">
                                        <img src={img.url} className="w-full h-full object-cover" />
                                        <input
                                            type="text"
                                            placeholder="URL"
                                            value={img.url}
                                            onChange={(e) => {
                                                const newImgs = [...images];
                                                newImgs[idx].url = e.target.value;
                                                setImages(newImgs);
                                            }}
                                            className="absolute bottom-2 left-2 right-2 px-3 py-2 bg-white/90 rounded-xl text-[10px] font-bold border focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setImages([...images, { url: "", alt: "", order: images.length }])}
                                    className="aspect-[4/5] rounded-[32px] border-4 border-dashed border-[#E8DCC8] flex flex-col items-center justify-center text-[#E8DCC8] hover:text-[#7C8C5C] hover:border-[#7C8C5C] transition-all gap-4"
                                >
                                    <Plus className="w-12 h-12" />
                                    <span className="text-xs font-black uppercase tracking-widest">Add Image</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Pricing & Status */}
                        <div className="bg-[#2B2B2B] p-10 rounded-[40px] shadow-3xl text-white space-y-8 sticky top-32">
                            <h3 className="text-xl font-black">Publish Settings</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Price (PKR)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-white/10 border-2 border-white/10 rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-black text-2xl transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Compare At (PKR)</label>
                                    <input
                                        type="number"
                                        name="compareAt"
                                        value={formData.compareAt}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-white/10 border-2 border-white/10 rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-black text-2xl transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-white/10 border-2 border-white/10 rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/10">
                                    <span className="text-xs font-black uppercase tracking-widest">Featured Item</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData((prev: any) => ({ ...prev, featured: e.target.checked }))}
                                        />
                                        <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#7C8C5C]"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/10">
                                    <span className="text-xs font-black uppercase tracking-widest">Top Pick Week</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={formData.isTopPick}
                                            onChange={(e) => setFormData((prev: any) => ({ ...prev, isTopPick: e.target.checked }))}
                                        />
                                        <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-[#7C8C5C] hover:bg-[#A3B38A] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Update Product
                            </button>
                        </div>

                        {/* Classification */}
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-8">
                            <h3 className="text-xl font-black text-[#2B2B2B]">Classification</h3>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Brand</label>
                                <select
                                    name="brandId"
                                    required
                                    value={formData.brandId}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all appearance-none"
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Category</label>
                                <select
                                    name="categoryId"
                                    required
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Condition</label>
                                <select
                                    name="condition"
                                    required
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all appearance-none"
                                >
                                    <option value="New">New / Deadstock</option>
                                    <option value="Pre-loved">Pre-loved / Used</option>
                                    <option value="Premium">Premium Curated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
