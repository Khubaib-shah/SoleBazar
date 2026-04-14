"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import CloudinaryUpload from "@/components/admin/cloudinary-upload";
import SortableImage from "@/components/admin/sortable-image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | "";
  condition: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  isTopPick: boolean;
  brandId: string;
  categoryId: string;
  gender: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [formData, setFormData] = useState<FormData>({
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
    gender: "Unisex",
  });

  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/brands"),
          fetch("/api/admin/categories"),
        ]);
        setBrands(await brandsRes.json());
        setCategories(await categoriesRes.json());
      } catch (err) {
        toast.error("Error loading form data");
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));

    // Auto-generate slug from name
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      }));
    }
  };

  const handleAddSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const handleAddColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => (item.id || item.url) === active.id);
        const newIndex = items.findIndex((item) => (item.id || item.url) === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCloudinaryUpload = (url: string) => {
    setImages((prev) => [...prev, { id: url, url, alt: formData.name, order: prev.length }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandId || !formData.categoryId) {
      toast.error("Please select a brand and category");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sizes: JSON.stringify(formData.sizes),
          colors: JSON.stringify(formData.colors),
          images,
        }),
      });

      if (res.ok) {
        toast.success("Product created successfully!");
        router.push("/admin/products");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create product");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold md:font-black text-[#2B2B2B]">
          Create New Product
        </h1>
        <Link
          href="/admin/products"
          className="flex items-center gap-1 md:gap-3 text-[10px] md:text-sm font-bold md:font-black uppercase tracking-widest text-[#7C8C5C] hover:text-[#5D6B44] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
          {/* Main Info Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-4 md:p-8 lg:p-10 rounded-[20px] md:rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-4 md:space-y-8">
              <h3 className="text-lg md:text-xl font-bold md:font-black text-[#2B2B2B]">
                General Information
              </h3>

              <div className="space-y-2">
                <label className="text-[10px] font-bold md:font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-2 md:py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold md:font-black text-xs md:text-sm transition-all shadow-inner"
                  placeholder="e.g. Nike Air Max Plus OG"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold md:font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                  Slug (URL Identifier)
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-2 md:py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold md:font-black text-xs md:text-sm transition-all text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold md:font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-2 md:py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold md:font-black text-xs md:text-sm transition-all resize-none shadow-inner"
                  placeholder="Describe the condition, material, and uniqueness..."
                />
              </div>
            </div>

            {/* Sizes & Colors Section */}
            <div className="bg-white p-4 md:p-8 lg:p-10 rounded-[20px]  md:rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-4 md:space-y-8">
              <h3 className="text-lg md:text-xl font-bold md:font-black text-[#2B2B2B]">Attributes</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold md:font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                    Available Sizes
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSize())
                      }
                      className="flex-1 px-2 md:px-6 py-3 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold md:font-black text-xs md:text-sm w-40 md:w-full"
                      placeholder="e.g. 10.5"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-4 bg-[#7C8C5C] text-white rounded-xl md:rounded-2xl hover:bg-[#5D6B44] transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.map((size) => (
                      <span
                        key={size}
                        className="bg-[#E8DCC8]/30 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-sm font-bold md:font-black text-[#7C8C5C] uppercase flex items-center gap-2"
                      >
                        {size}
                        <button type="button" onClick={() => removeSize(size)}>
                          <Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                    Available Colors
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddColor())
                      }
                      className="flex-1 px-2 md:px-6 py-3 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-2xl focus:outline-none focus:border-[#7C8C5C] font-bold text-xs md:text-sm w-40 md:w-full"
                      placeholder="e.g. Triple Black"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-4 bg-[#7C8C5C] text-white rounded-xl md:rounded-2xl hover:bg-[#5D6B44] transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color) => (
                      <span
                        key={color}
                        className="bg-[#E8DCC8]/30 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-sm font-bold md:font-black text-[#7C8C5C] uppercase flex items-center gap-2"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                        >
                          <Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Images Column */}
            <div className="bg-white p-4 md:p-8 lg:p-10 rounded-[20px] md:rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-4 md:space-y-8">
              <h3 className="text-lg md:text-xl font-black text-[#2B2B2B]">Visual Gallery</h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <SortableContext
                    items={images.map(img => img.id || img.url)}
                    strategy={rectSortingStrategy}
                  >
                    {images.map((img, idx) => (
                      <SortableImage
                        key={img.id || img.url || idx}
                        id={img.id || img.url}
                        url={img.url}
                        index={idx}
                        onRemove={(index) => setImages(images.filter((_, i) => i !== index))}
                      />
                    ))}
                  </SortableContext>
                  <CloudinaryUpload onUpload={handleCloudinaryUpload} />
                </div>
              </DndContext>

              <div className="p-2 md:p-4 bg-orange-50 rounded-2xl flex items-start gap-2 md:gap-4 border border-orange-100 mt-6">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <p className="text-[8px] md:text-sm font-bold text-orange-600 leading-relaxed uppercase tracking-widest">
                  Images are securely uploaded to Cloudinary. Drag to reorder, top-left handle to move.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-4 md:space-y-8 lg:sticky lg:top-24 lg:col-span-3 self-start">
            <div className="bg-white p-4 md:p-8 lg:p-10 rounded-[20px] md:rounded-[40px] shadow-sm border border-[#E8DCC8] space-y-4 md:space-y-8">
              <h3 className="text-lg md:text-xl font-black text-[#2B2B2B]">
                Classification
              </h3>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                  Brand
                </label>
                <select
                  name="brandId"
                  required
                  value={formData.brandId}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-xs md:text-sm transition-all appearance-none"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                  Category
                </label>
                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-xs md:text-sm transition-all appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                  Gender
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-xs md:text-sm transition-all appearance-none"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-2 md:ml-4">
                  Initial Condition
                </label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-xs md:text-sm transition-all appearance-none"
                >
                  <option value="New">New / Deadstock</option>
                  <option value="Pre-loved">Pre-loved / Used</option>
                  <option value="Premium">Premium Curated</option>
                </select>
              </div>
            </div>

            <div className="bg-[#2B2B2B] p-4 md:p-10 rounded-[20px] md:rounded-[40px] shadow-2xl text-white space-y-4 md:space-y-8">
              <h3 className="text-lg md:text-xl font-black">Publish Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold md:font-black uppercase tracking-widest text-gray-400 ml-2 md:ml-4">
                    Regular Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-2 md:px-6 py-2 md:py-4 bg-white/10 border-2 border-white/10  rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold md:font-black  text-xs md:text-sm text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold md:font-black uppercase tracking-widest text-gray-400 ml-2 md:ml-4">
                    Compare Price (Optional)
                  </label>
                  <input
                    type="number"
                    name="compareAt"
                    value={formData.compareAt}
                    onChange={handleInputChange}
                    className="w-full px-2 md:px-6 py-2 md:py-4 bg-white/10 border-2 border-white/10 rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold md:font-black text-xs sm:text-sm md:text-xl text-white transition-all opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-sm font-bold md:font-black uppercase tracking-widest text-gray-400 ml-2 md:ml-4">
                  Inventory Count
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-2 md:px-6 py-2 md:py-4 bg-white/10 border-2 border-white/10  rounded-xl md:rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold md:font-black text-xs sm:text-sm md:text-xl text-white transition-all"
                />
              </div>

              <div className="flex items-center justify-between p-2 md:p-6 bg-white/5 rounded-xl md:rounded-3xl border border-white/10">
                <span className="text-xs font-bold md:font-black uppercase tracking-widest">
                  Featured Item
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#7C8C5C]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-2 md:p-6 bg-white/5 rounded-xl md:rounded-3xl border border-white/10">
                <span className="text-xs font-bold md:font-black uppercase tracking-widest">
                  Top Pick Week
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isTopPick}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isTopPick: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7C8C5C] hover:bg-[#A3B38A] text-white py-2 md:py-6 rounded-xl md:rounded-3xl font-bold md:font-black text-xs sm:text-sm md:text-xl uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Product
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
