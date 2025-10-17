"use client";

import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import ProductCard from "./product-card";

const PRODUCTS = [
  {
    id: 1,
    name: "Dread locks sneakers",
    brand: "Cat & Sofa",
    price: 1800,
    condition: "Pre-loved",
    size: "8",
    image: "/Cat_sofa.png",
  },
  {
    id: 2,
    name: "Adidas Stan Smith",
    brand: "Adidas",
    price: 3200,
    condition: "New",
    size: "9",
    image: "/adidas-stan-smith-white-sneaker.jpg",
  },
  {
    id: 3,
    name: "Puma RS-X",
    brand: "Puma",
    price: 3800,
    condition: "Pre-loved",
    size: "11",
    image: "/puma-rs-x-retro-sneaker.jpg",
  },
  {
    id: 4,
    name: "Nike Jordan 1 Low",
    brand: "Nike",
    price: 5500,
    condition: "New",
    size: "10",
    image: "/nike-jordan-1-low-sneaker.jpg",
  },
  {
    id: 5,
    name: "Adidas Ultraboost",
    brand: "Adidas",
    price: 4200,
    condition: "Pre-loved",
    size: "9.5",
    image: "/adidas-ultraboost-black-sneaker.jpg",
  },
  {
    id: 6,
    name: "Puma Suede Classic",
    brand: "Puma",
    price: 2800,
    condition: "New",
    size: "8",
    image: "/puma-suede-classic-vintage-sneaker.jpg",
  },
  {
    id: 7,
    name: "Nike Blazer Mid",
    brand: "Nike",
    price: 4000,
    condition: "Pre-loved",
    size: "10",
    image: "/nike-blazer-mid-classic-sneaker.jpg",
  },
  {
    id: 8,
    name: "Adidas NMD R1",
    brand: "Adidas",
    price: 3900,
    condition: "New",
    size: "9",
    image: "/adidas-nmd-r1-modern-sneaker.jpg",
  },
];

const BRANDS = ["All", "Nike", "Adidas", "Puma", "Cat & Sofa"];
const CONDITIONS = ["All", "New", "Pre-loved"];
const SIZES = ["All", "8", "9", "9.5", "10", "10.5", "11"];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  },
};

export default function Shop() {
  const [filters, setFilters] = useState({
    brand: "All",
    condition: "All",
    size: "All",
  });

  // ✅ Efficiently compute filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const brandMatch = filters.brand === "All" || p.brand === filters.brand;
      const conditionMatch =
        filters.condition === "All" || p.condition === filters.condition;
      const sizeMatch = filters.size === "All" || p.size === filters.size;
      return brandMatch && conditionMatch && sizeMatch;
    });
  }, [filters]);

  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <section id="shop" className="py-20 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-[#2B2B2B] mb-12 text-center">
          Our Collection
        </h2>

        {/* Filters */}
        <div className="mb-12 grid md:grid-cols-3 gap-6">
          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
              Brand
            </label>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleFilterChange("brand", brand)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    filters.brand === brand
                      ? "bg-[#7C8C5C] text-white"
                      : "bg-white text-[#2B2B2B] border border-[#E8DCC8] hover:bg-[#f4f2ec]"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
              Condition
            </label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((condition) => (
                <button
                  key={condition}
                  onClick={() => handleFilterChange("condition", condition)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    filters.condition === condition
                      ? "bg-[#7C8C5C] text-white"
                      : "bg-white text-[#2B2B2B] border border-[#E8DCC8] hover:bg-[#f4f2ec]"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-semibold text-[#2B2B2B] mb-3">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleFilterChange("size", size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    filters.size === size
                      ? "bg-[#7C8C5C] text-white"
                      : "bg-white text-[#2B2B2B] border border-[#E8DCC8] hover:bg-[#f4f2ec]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-[#555]">
                No shoes found matching your filters.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
