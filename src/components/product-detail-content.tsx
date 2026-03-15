"use client";

import { useState } from "react";
import { MessageCircle, ShieldCheck, Clock } from "lucide-react";
import OrderModal from "./order-modal";
import SizeGuide from "./size-guide";

interface Product {
    id: string;
    name: string;
    price: number;
    compareAt?: number | null;
    description?: string | null;
    condition: string;
    brand: { name: string };
    slug: string;
    sizes: string;
    colors?: string | null;
    images?: { url: string }[];
}

export default function ProductDetailContent({ product }: { product: Product }) {
    const sizes = JSON.parse(product.sizes || "[]");
    const colors = JSON.parse(product?.colors || "[]");

    const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
    const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
    const [isTitleExpanded, setIsTitleExpanded] = useState(false);
    const titleWords = product.name.split(' ');
    const isTitleLong = titleWords.length > 5;
    const displayedTitle = isTitleLong && !isTitleExpanded 
        ? titleWords.slice(0, 5).join(' ') + '...' 
        : product.name;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <span className="bg-[#7C8C5C] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                        {product.brand.name}
                    </span>
                    <span className="text-[10px] text-[#555] font-black uppercase tracking-widest bg-white/50 px-4 py-1.5 rounded-full border border-[#E8DCC8]">
                        {product.condition}
                    </span>
                </div>
                <h1 
                    onClick={() => isTitleLong && setIsTitleExpanded(!isTitleExpanded)}
                    className={`text-4xl md:text-5xl font-black text-[#2B2B2B] mb-4 leading-tight ${
                        isTitleLong ? 'cursor-pointer hover:text-[#7C8C5C] transition-colors' : ''
                    } ${isTitleLong && isTitleExpanded ? 'max-w-xl' : ''}`}
                >
                    {displayedTitle}
                </h1>
                <div className="flex items-baseline gap-4 mb-4">
                    <p className="text-4xl font-black text-[#7C8C5C]">
                        <span className="text-xl mr-2">PKR</span>
                        {product.price.toLocaleString()}
                    </p>
                    {product.compareAt && (
                        <p className="text-xl text-gray-400 line-through font-bold">
                            PKR {product.compareAt.toLocaleString()}
                        </p>
                    )}
                </div>
                <p className="text-lg text-[#555] leading-relaxed mb-8 max-w-xl">
                    {product.description ||
                        "No description provided for this product. Premium quality footwear curated from top brands."}
                </p>
            </div>

            {/* Sizes & Attributes */}
            <div className="mb-10 space-y-8">
                {sizes.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-[#2B2B2B] uppercase tracking-[0.2em]">
                                Available Sizes
                            </h3>
                            <SizeGuide />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {sizes.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 border-2 rounded-2xl flex items-center justify-center font-black transition-all hover:scale-110 shadow-sm active:scale-95 ${selectedSize === size
                                            ? "bg-[#2B2B2B] text-white border-[#2B2B2B]"
                                            : "bg-white text-[#2B2B2B] border-[#E8DCC8] hover:border-[#7C8C5C]"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {colors.length > 0 && (
                    <div>
                        <h3 className="text-sm font-black text-[#2B2B2B] uppercase tracking-[0.2em] mb-4">
                            Colors
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-5 py-2.5 border-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm transition-all ${selectedColor === color
                                            ? "bg-[#2B2B2B] text-white border-[#2B2B2B]"
                                            : "bg-white text-[#555] border-[#E8DCC8] hover:border-[#7C8C5C]"
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-4">
                <OrderModal
                    product={product}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-[#E8DCC8] flex items-center gap-4">
                        <ShieldCheck className="w-6 h-6 text-[#7C8C5C]" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#555]">
                                Authenticity
                            </p>
                            <p className="text-xs font-bold text-[#2B2B2B]">100% Guaranteed</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-[#E8DCC8] flex items-center gap-4">
                        <Clock className="w-6 h-6 text-[#7C8C5C]" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#555]">
                                Fast Delivery
                            </p>
                            <p className="text-xs font-bold text-[#2B2B2B]">Karachi 24h, PK 2-3d</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
