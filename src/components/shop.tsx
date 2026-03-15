"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Box,
  Ruler,
  RefreshCcw,
  Loader2,
  Filter,
  ChevronDown,
  Plus,
  Users
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ProductCard from "./product-card";
import { ProductWithRelations } from "@/lib/types";
import SizeGuide from "./size-guide";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ShopProps {
  featuredOnly?: boolean;
  title?: string;
  subtitle?: string;
}

const CONDITIONS = ["All", "New", "Pre-loved"];
const SIZES = ["All", "7", "8", "9", "9.5", "10", "10.5", "11"];
const GENDERS = ["All", "Men", "Women", "Unisex"];

const FloatingPlus = ({ className, delay = 0 }: { className: string, delay?: number }) => (
  <motion.div
    animate={{
      rotate: [0, 90, 0],
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 0.6, 0.3]
    }}
    transition={{ duration: 4, repeat: Infinity, delay }}
    className={className}
  >
    <Plus className="w-5 h-5" />
  </motion.div>
);

export default function Shop({ 
  featuredOnly = false,
  title = "Our Collection",
  subtitle = "Discover curated sneakers for your style. High-quality pieces at competitive prices."
}: ShopProps) {
  const searchParams = useSearchParams();
  const apiUri = featuredOnly ? "/api/products?featured=true" : "/api/products";
  const { data: products = [], error: productsError, isLoading: productsLoading } = useSWR<ProductWithRelations[]>(apiUri, fetcher);
  const { data: brands = [], error: brandsError, isLoading: brandsLoading } = useSWR<any[]>("/api/brands", fetcher);
  const { data: categories = [], error: categoriesError, isLoading: categoriesLoading } = useSWR<any[]>("/api/categories", fetcher);

  const [filters, setFilters] = useState({
    brand: "All",
    category: "All",
    gender: "All",
    condition: "All",
    size: "All",
  });

  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);

  useEffect(() => {
    const genderParam = searchParams.get("gender");
    if (genderParam && GENDERS.includes(genderParam)) {
      setFilters(prev => ({ ...prev, gender: genderParam }));
    } else if (!genderParam) {
      setFilters(prev => ({ ...prev, gender: "All" }));
    }
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<"brand" | "category" | "gender" | "condition" | "size">("brand");

  const loading = productsLoading || brandsLoading || categoriesLoading;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const brandMatch = filters.brand === "All" || p.brand.name === filters.brand;
      const categoryMatch = filters.category === "All" || p.category.name === filters.category;
      const genderMatch = filters.gender === "All" || p.gender === filters.gender;
      const conditionMatch =
        filters.condition === "All" || p.condition === filters.condition;

      // Handle sizes which are stored as JSON string in the DB
      let sizeMatch = filters.size === "All";
      if (!sizeMatch && p.sizes) {
        try {
          const productSizes = JSON.parse(p.sizes);
          sizeMatch = productSizes.includes(filters.size);
        } catch (e) {
          sizeMatch = p.sizes === filters.size;
        }
      }

      return brandMatch && categoryMatch && genderMatch && conditionMatch && sizeMatch;
    });
  }, [filters, products]);

  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      brand: "All",
      category: "All",
      gender: "All",
      condition: "All",
      size: "All",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#7C8C5C]" />
      </div>
    );
  }

  return (
    <section id="shop" className="py-24 bg-[#FAFAF7] relative overflow-hidden">
      {/* Large Decorative SVGs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingPlus className="absolute top-[10%] left-[5%] text-[#7C8C5C]" delay={0} />
        <FloatingPlus className="absolute top-[30%] right-[5%] text-[#E8DCC8] scale-150" delay={1} />
        <FloatingPlus className="absolute bottom-[20%] left-[8%] text-[#2B2B2B] scale-[2]" delay={2} />
        <FloatingPlus className="absolute bottom-[10%] right-[15%] text-[#7C8C5C] scale-110" delay={1.5} />

        {/* Large Background Circles */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] border-2 border-[#7C8C5C]/30 rounded-full"
        />

        {/* Large X-Shape */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[50%] right-[-100px] text-[#2B2B2B] opacity-[0.1]"
        >
          <svg width="400" height="400" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-[#2B2B2B] mb-4">
              {title}
            </h2>
            <p className="text-[#555] max-w-md">
              {subtitle}
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-sm font-bold text-[#7C8C5C] hover:text-[#5D6B44] transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset All Filters
          </button>
        </div>

        {/* Premium Filter UI */}
        <div className="flex flex-col gap-8 mb-16 relative z-50">
          {/* Filters Bar */}
          <div className="bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-[#E8DCC8] flex flex-wrap items-center justify-center gap-2 relative">
            {[
              { id: 'category', label: 'Collection', icon: Box, value: filters.category, options: categories.map((c: any) => c.name) },
              { id: 'brand', label: 'Brand', icon: Tag, value: filters.brand, options: brands.map(b => b.name) },
              { id: 'gender', label: 'Gender', icon: Users, value: filters.gender, options: GENDERS.filter(g => g !== "All") },
              { id: 'condition', label: 'Condition', icon: Box, value: filters.condition, options: CONDITIONS.filter(c => c !== "All") },
              { id: 'size', label: 'Size', icon: Ruler, value: filters.size, options: SIZES.filter(s => s !== "All") },
            ].map((f) => (
              <div key={f.id} className="relative">
                <button
                  onClick={() => setActiveFilterTab(activeFilterTab === f.id ? null : f.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeFilterTab === f.id || f.value !== "All"
                    ? "bg-[#7C8C5C] text-white shadow-lg"
                    : "hover:bg-[#E8DCC8]/30 text-[#555]"
                    }`}
                >
                  <f.icon className="w-3.5 h-3.5" />
                  <span>{f.label}: {f.value}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeFilterTab === f.id ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {activeFilterTab === f.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-3 z-50 min-w-[200px] bg-white rounded-2xl shadow-2xl border border-[#E8DCC8] p-3 overflow-hidden"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => { handleFilterChange(f.id as any, "All"); setActiveFilterTab(null); }}
                          className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-colors ${f.value === "All" ? "bg-[#7C8C5C]/10 text-[#7C8C5C]" : "hover:bg-gray-50 text-[#555]"}`}
                        >
                          All {f.label}s
                        </button>
                        {f.options.map((opt: string) => (
                          <button
                            key={opt}
                            onClick={() => { handleFilterChange(f.id as any, opt); setActiveFilterTab(null); }}
                            className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-colors ${f.value === opt ? "bg-[#7C8C5C]/10 text-[#7C8C5C]" : "hover:bg-gray-50 text-[#555]"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ))}

            <SizeGuide />
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(filters) + products.length}
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3  gap-8 no-scrollbar"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F5EBDC] rounded-full mb-6">
                  <Filter className="w-8 h-8 text-[#7C8C5C]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2B2B2B] mb-2">No shoes matches</h3>
                <p className="text-[#555]">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2 bg-[#7C8C5C] text-white rounded-lg font-bold hover:bg-[#5D6B44] transition-base"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {featuredOnly && (
          <div className="mt-16 flex justify-center">
            <Link
              href="/products"
              className="flex items-center gap-3 px-10 py-5 bg-[#2B2B2B] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#7C8C5C] transition-all shadow-xl active:scale-95 group"
            >
              View Full Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
