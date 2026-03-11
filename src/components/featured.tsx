"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ProductCard from "./product-card";

export default function Featured() {
  const { data: products = [], error, isLoading: loading } = useSWR<any[]>("/api/products/top-picks", fetcher);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 20);
      setCanScrollRight(
        scrollRef.current.scrollLeft <
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 20
      );
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#999]">Curating Top Picks...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section id="featured" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[#7C8C5C] font-black text-[10px] uppercase tracking-[0.3em] mb-4">Curated Collection</p>
            <h2 className="text-5xl font-black text-[#2B2B2B] leading-tight">
              Top Picks <span className="text-[#7C8C5C]">of the Week</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${canScrollLeft ? "bg-[#2B2B2B] text-white shadow-xl hover:-translate-x-1" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${canScrollRight ? "bg-[#2B2B2B] text-white shadow-xl hover:translate-x-1" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-8 overflow-x-auto no-scrollbar pb-10 px-2 -mx-2"
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[320px] md:w-[350px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
