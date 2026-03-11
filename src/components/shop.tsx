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
  ChevronDown
} from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ProductCard from "./product-card";
import { ProductWithRelations } from "@/lib/types";

const CONDITIONS = ["All", "New", "Pre-loved"];
const SIZES = ["All", "7", "8", "9", "9.5", "10", "10.5", "11"];

export default function Shop() {
  const { data: products = [], error: productsError, isLoading: productsLoading } = useSWR<ProductWithRelations[]>("/api/products", fetcher);
  const { data: brands = [], error: brandsError, isLoading: brandsLoading } = useSWR<any[]>("/api/brands", fetcher);

  const [filters, setFilters] = useState({
    brand: "All",
    condition: "All",
    size: "All",
  });

  const [activeTab, setActiveTab] = useState<"brand" | "condition" | "size">("brand");

  const loading = productsLoading || brandsLoading;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const brandMatch = filters.brand === "All" || p.brand.name === filters.brand;
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

      return brandMatch && conditionMatch && sizeMatch;
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
    <section id="shop" className="py-24 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-[#2B2B2B] mb-4">
              Our Collection
            </h2>
            <p className="text-[#555] max-w-md">
              Discover curated sneakers for your style. High-quality pieces at competitive prices.
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

        {/* Improved Filter UI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DCC8] mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Filter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-[#7C8C5C]" />
                <span className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">Brands</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange("brand", "All")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${filters.brand === "All"
                    ? "bg-[#7C8C5C] text-white shadow-md scale-105"
                    : "bg-[#FAFAF7] text-[#2B2B2B] hover:bg-[#F5EBDC]"
                    }`}
                >
                  All
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleFilterChange("brand", brand.name)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${filters.brand === brand.name
                      ? "bg-[#7C8C5C] text-white shadow-md scale-105"
                      : "bg-[#FAFAF7] text-[#2B2B2B] hover:bg-[#F5EBDC]"
                      }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Box className="w-4 h-4 text-[#7C8C5C]" />
                <span className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">Condition</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => handleFilterChange("condition", condition)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${filters.condition === condition
                      ? "bg-[#7C8C5C] text-white shadow-md scale-105"
                      : "bg-[#FAFAF7] text-[#2B2B2B] hover:bg-[#F5EBDC]"
                      }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ruler className="w-4 h-4 text-[#7C8C5C]" />
                <span className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">Size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange("size", size)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${filters.size === size
                      ? "bg-[#7C8C5C] text-white shadow-md scale-105"
                      : "bg-[#FAFAF7] text-[#2B2B2B] hover:bg-[#F5EBDC]"
                      }`}
                  >
                    {size === "All" ? "All" : size}
                  </button>
                ))}
              </div>
            </div>
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
      </div>
    </section>
  );
}
