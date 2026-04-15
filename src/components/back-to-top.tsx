"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible || pathname?.startsWith("/admin")) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 p-3 md:p-4 bg-[#7C8C5C] text-white rounded-2xl shadow-2xl hover:bg-[#5D6B44] transition-all transform hover:scale-110 active:scale-95 group border-2 border-white/20"
            aria-label="Back to top"
        >
            <ArrowUp className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
    );
}
