"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

const FEATURED_SHOES = [
  {
    id: 1,
    name: "Nike Air Max 90",
    brand: "Nike",
    price: 4500,
    image: "/nike.png",
  },
  {
    id: 2,
    name: "Adidas Stan Smith",
    brand: "Adidas",
    price: 3200,
    image: "/addidas.png",
  },
  {
    id: 3,
    name: "Puma RS-X",
    brand: "Puma",
    price: 3800,
    image: "/puma.png",
  },
  {
    id: 4,
    name: "Nike Jordan 1",
    brand: "Nike",
    price: 5500,
    image: "/nike.png",
  },
];

export default function Featured() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft <
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-[#2B2B2B] mb-12 text-center">
          Top Picks of the Week
        </h2>

        <div className="relative">
          {/* Carousel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {FEATURED_SHOES.map((shoe) => (
              <div
                key={shoe.id}
                className="flex-shrink-0 w-72 bg-[#FAFAF7] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <div className="aspect-square overflow-hidden bg-[#F5EBDC]">
                  <img
                    src={shoe.image || "/placeholder.svg"}
                    alt={shoe.name}
                    className="w-full h-full rotate-y-180 scale-110  object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#7C8C5C] font-semibold uppercase mb-1">
                    {shoe.brand}
                  </p>
                  <h3 className="text-lg font-bold text-[#2B2B2B] mb-2">
                    {shoe.name}
                  </h3>
                  <p className="text-xl font-bold text-[#7C8C5C]">
                    PKR {shoe.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#7C8C5C] text-white p-2 rounded-full hover:bg-[#6B7A4F] transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[#7C8C5C] text-white p-2 rounded-full hover:bg-[#6B7A4F] transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
