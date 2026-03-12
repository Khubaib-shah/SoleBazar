"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Hassan",
      role: "Verified Collector",
      quote: "Found the perfect vintage Nike Air Max at an unbeatable price. Quality is amazing!",
      rating: 5,
    },
    {
      id: 2,
      name: "Fatima Khan",
      role: "Streetwear Enthusiast",
      quote: "SoleBazar has the best collection of thrifted sneakers in Karachi. Highly recommend!",
      rating: 5,
    },
    {
      id: 3,
      name: "Hassan Ali",
      role: "Frequent Buyer",
      quote: "Great customer service and authentic shoes. Will definitely order again!",
      rating: 5,
    },
    {
      id: 4,
      name: "Zara Malik",
      role: "Style Influencer",
      quote: "Love the aesthetic of the website and the quality of the shoes. Worth every penny!",
      rating: 5,
    },
    {
      id: 5,
      name: "Bilal Sheikh",
      role: "Sneakerhead",
      quote: "The authentication process here is top-notch. Peace of mind with every purchase.",
      rating: 5,
    },
    {
      id: 6,
      name: "Sana Javed",
      role: "Daily Runner",
      quote: "Got my Ultraboosts here for half the retail price. Condition was like new!",
      rating: 5,
    },
    {
      id: 7,
      name: "Omar Farooq",
      role: "Vintage Hunter",
      quote: "Managed to find a rare 1990s colorway in my exact size. Absolute gem of a store.",
      rating: 5,
    },
    {
      id: 8,
      name: "Mariam Aziz",
      role: "Gift Buyer",
      quote: "Ordered sneakers for my brother. Delivery was fast and the packaging was premium.",
      rating: 5,
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false
  }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  return (
    <section className="py-32 bg-[#FAFAF7] overflow-hidden">
      <div className="text-center mb-20 px-4">
        <p className="text-[#7C8C5C] font-black text-[10px] uppercase tracking-[0.3em] mb-4">
          The Sole Experience
        </p>
        <h2 className="text-5xl font-black text-[#2B2B2B]">
          Words from the <span className="text-[#7C8C5C]">Community</span>
        </h2>
      </div>

      {/* Embla Carousel Structure - Full Width Peek */}
      <div className="embla relative">
        <div className="embla__viewport overflow-visible" ref={emblaRef}>
          <div className="embla__container flex py-10">
            {testimonials.map((testimonial, index) => {
              const isActive = selectedIndex === index;
              return (
                <div
                  key={testimonial.id}
                  className="embla__slide flex-[0_0_85%] sm:flex-[0_0_60%] lg:flex-[0_0_50%] px-4 min-w-0 transition-all duration-500 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0.4,
                    transform: isActive ? 'scale(1.05)' : 'scale(0.9)',
                  }}
                >
                  <div className={`bg-white p-10 rounded-[50px] transition-all duration-500 h-full border ${isActive ? 'border-[#7C8C5C]/30 shadow-xl' : 'border-[#E8DCC8]/30 shadow-sm'} flex flex-col group relative`}>
                    {/* Quote Icon Overlay */}
                    <div className={`absolute top-10 right-10 transition-colors duration-500 ${isActive ? 'text-[#7C8C5C]/20' : 'text-[#F5EBDC]'}`}>
                      <Quote className="w-16 h-16 rotate-180" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-8">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 transition-colors duration-500 ${isActive ? 'fill-[#7C8C5C] text-[#7C8C5C]' : 'fill-gray-300 text-gray-300'}`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className={`text-xl font-black text-[#2B2B2B] mb-12 leading-relaxed flex-1 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                      &quot;{testimonial.quote}&quot;
                    </p>

                    {/* Author Card */}
                    <div className="flex items-center gap-5 mt-auto">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-2xl shadow-inner transition-all duration-500 ${isActive ? 'bg-[#7C8C5C] text-white rotate-3 scale-110' : 'bg-[#F5EBDC] text-[#7C8C5C]'}`}>
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-[#2B2B2B] text-base uppercase tracking-widest leading-none mb-2">
                          {testimonial.name}
                        </p>
                        <p className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-[#7C8C5C]' : 'text-gray-400'}`}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-12 px-4 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <button
              onClick={scrollPrev}
              className="w-14 h-14 rounded-full border-2 border-[#2B2B2B] flex items-center justify-center hover:bg-[#2B2B2B] hover:text-white transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollNext}
              className="w-14 h-14 rounded-full border-2 border-[#2B2B2B] flex items-center justify-center hover:bg-[#2B2B2B] hover:text-white transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-3 rounded-full transition-all duration-500 ${selectedIndex === index ? "w-10 bg-[#7C8C5C]" : "w-3 bg-[#E8DCC8]"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
