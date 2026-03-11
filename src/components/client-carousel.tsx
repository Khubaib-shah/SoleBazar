"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ClientCarousel({ images }: { images: string[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
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
        <div className="relative h-full group overflow-hidden">
            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container h-full flex">
                    {images.map((src, index) => (
                        <div key={index} className="embla__slide flex-[0_0_100%] h-full">
                            <img
                                src={src}
                                alt={`Product Image ${index + 1}`}
                                className="w-full h-full object-cover select-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#2B2B2B] rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/30"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#2B2B2B] rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/30"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
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
    );
}
