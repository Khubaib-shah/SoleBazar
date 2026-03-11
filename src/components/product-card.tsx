"use client";

import { useState } from "react";
import { MessageCircle, ExternalLink, Tag, Ruler } from "lucide-react";
import Link from "next/link";
import { ProductWithRelations } from "@/lib/types";

export default function ProductCard({ product }: { product: ProductWithRelations }) {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappMessage = `Hi! I'm interested in the ${product.name} (${product.brand.name}) - Condition: ${product.condition}. Price: PKR ${product.price}`;
  const whatsappLink = `https://api.whatsapp.com/send?phone=923162126865&text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const mainImage = product.images?.[0]?.url || "/placeholder.svg";

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#E8DCC8]/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5EBDC]">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-[#7C8C5C]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {product.condition}
          </div>
          {product.featured && (
            <div className="bg-[#2B2B2B]/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Featured
            </div>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href={`/product/${product.slug}`}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2B2B2B] hover:bg-[#7C8C5C] hover:text-white transition-all transform hover:scale-110 shadow-xl"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-3 h-3 text-[#7C8C5C]" />
          <p className="text-[10px] text-[#7C8C5C] font-black uppercase tracking-widest">
            {product.brand.name}
          </p>
        </div>

        <h3 className="text-xl font-bold text-[#2B2B2B] mb-3 line-clamp-1 group-hover:text-[#7C8C5C] transition-colors">
          {product.name}
        </h3>

        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest mb-1">Price</p>
            <p className="text-2xl font-black text-[#2B2B2B]">
              <span className="text-sm font-bold mr-1">PKR</span>
              {product.price.toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 text-[10px] text-[#555] font-bold uppercase tracking-widest">
              <Ruler className="w-3 h-3" />
              Sizes available
            </div>
            <p className="text-sm font-bold text-[#2B2B2B]">
              {JSON.parse(product.sizes || "[]").length} Options
            </p>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 bg-[#2B2B2B] hover:bg-[#7C8C5C] text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-[#7C8C5C]/20"
        >
          <MessageCircle className="w-4 h-4" />
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
