"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ProductWithRelations } from "@/lib/types";
import { useAnalytics } from "@/hooks/use-analytics";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

interface ProductCardProps {
  product: ProductWithRelations;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images =
    product.images?.length > 0
      ? product.images.map((img) => img.url)
      : ["/placeholder.svg"];

  const whatsappMessage = `Hi! I'm interested in the ${product.name} (${product.brand.name}) - Condition: ${product.condition}. Price: PKR ${product.price}`;
  const whatsappLink = `https://api.whatsapp.com/send?phone=923149784156&text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    duration: 35,
    skipSnaps: false
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentImageIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1 && emblaApi) {
      interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length, emblaApi]);

  const { trackEvent } = useAnalytics();

  const handleTrackClick = () => {
    trackEvent({
      eventType: "product_click",
      productId: product.id
    });
  };

  return (
    <div
      className="group relative bg-white rounded-[32px] p-4 shadow-lg hover:shadow-2xl transition-all duration-500 max-w-[360px] mx-auto flex flex-col h-full border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#F5EBDC]">
        <div className="w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex w-full h-full touch-pan-y touch-pinch-zoom">
            {images.map((img, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative">
                <Link 
                  href={`/product/${product.slug}`} 
                  className="block w-full h-full"
                  onClick={handleTrackClick}
                >
                  <img
                    src={img}
                    alt={`${product.name} - image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Overlays */}
        {/* Dynamic Smart Badge (Top Left) */}
        {(product.isTopPick || product.featured || product.condition) && (
          <div
            className={`absolute top-3 left-3 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 shadow-xl z-10 transition-colors ${
              product.isTopPick
                ? "bg-orange-600/90 text-white"
                : product.condition === "New"
                  ? "bg-[#7C8C5C]/90 text-white"
                  : "bg-[#2B2B2B]/80 text-white"
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.15em] drop-shadow-sm">
              {product.isTopPick ? "Best Seller" : product.condition}
            </span>
          </div>
        )}

        {/* Brand Logo (Top Right) */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 p-2 overflow-hidden">
          {product.brand.icon ? (
            <img
              src={product.brand.icon}
              alt={product.brand.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-[10px] font-black text-[#2B2B2B]">
              {product.brand.name.substring(0, 2)}
            </span>
          )}
        </div>

        {/* Carousel Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 z-20">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  emblaApi?.scrollTo(idx);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full hover:scale-125 ${
                  currentImageIndex === idx
                    ? "w-6 bg-white shadow-md"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information Section */}
      <div className="mt-6 flex-1 flex flex-col">
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`} onClick={handleTrackClick}>
            <h3 className="text-xl font-black text-[#2B2B2B] group-hover:text-[#7C8C5C] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {product.brand.name}
          </p>
        </div>

        <p className="mt-4 text-sm text-gray-400 font-medium line-clamp-2 leading-relaxed">
          {product.description ||
            "Premium curated sneaker from our exclusive collection. Authentic and high-quality."}
        </p>

        {/* Bottom Section (Price + Button) */}
        <div className="mt-auto pt-8 flex items-center justify-between gap-4">
          <div className="bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 shadow-inner">
            <span className="text-lg font-black text-[#2B2B2B]">
              <span className="text-[10px] mr-1">PKR</span>
              {product.price.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            onClick={handleTrackClick}
            className="flex items-center gap-2 bg-[#2B2B2B] hover:bg-[#7C8C5C] text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-[#7C8C5C]/30"
          >
            Buy Now
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
