"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: { id: string; url: string; alt?: string | null }[];
  showBadge?: boolean;
}

export default function ProductGallery({ images, showBadge }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="space-y-6">
      {/* Main Carousel */}
      <div className="bg-white rounded-2xl md:rounded-[48px] overflow-hidden shadow-2xl aspect-[4/5] relative border border-[#E8DCC8] group">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full flex">
            {images.map((img, index) => (
              <div key={img.id} className="embla__slide flex-[0_0_100%] h-full text-center">
                <img
                  src={img.url}
                  alt={img.alt || `Product Image ${index + 1}`}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            ))}
          </div>
        </div>

        {showBadge && (
          <div className="absolute top-2 left-2 md:top-8 md:left-8 bg-[#7C8C5C] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-10">
            Special Offer
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#2B2B2B] rounded-full flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 shadow-xl border border-white/30 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#2B2B2B] rounded-full flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 shadow-xl border border-white/30 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? "w-10 bg-white" : "w-2 bg-white/40"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => scrollTo(index)}
              className={`relative w-24 aspect-[4/5] rounded-[20px] overflow-hidden border-2 transition-all shadow-sm flex-shrink-0 ${selectedIndex === index
                ? "border-[#7C8C5C] scale-105 shadow-lg -translate-y-1"
                : "border-[#E8DCC8] hover:border-[#7C8C5C]/50"
                }`}
            >
              <img
                src={img.url}
                alt={img.alt || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-[#7C8C5C]/10 transition-opacity" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
