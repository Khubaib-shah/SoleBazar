"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  condition: string;
  size: string;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappMessage = `Hi! I'm interested in the ${product.name} (${product.brand}) - Size ${product.size}. Price: PKR ${product.price}`;
  const whatsappLink = `https://api.whatsapp.com/send?phone=923162126865&text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-102"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F5EBDC]">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Condition Badge */}
        <div className="absolute top-3 right-3 bg-[#7C8C5C] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.condition}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-[#7C8C5C] font-semibold uppercase tracking-wide mb-1">
          {product.brand}
        </p>
        <h3 className="text-lg font-bold text-[#2B2B2B] mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-[#7C8C5C]">
            PKR {product.price.toLocaleString()}
          </p>
          <p className="text-sm text-[#555]">Size {product.size}</p>
        </div>

        {/* Order Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#7C8C5C] hover:bg-[#6B7A4F] text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4" />
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
