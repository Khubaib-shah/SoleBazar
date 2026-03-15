"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/hooks/use-settings";
import { getInitials } from "@/lib/utils";

export default function Preloader() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const siteName = settings?.siteName || "SoleBazar";
  const initials = getInitials(siteName);

  useEffect(() => {
    // Hide static preloader immediately on hydration
    const staticLoader = document.getElementById("immediate-preloader");
    if (staticLoader) {
      staticLoader.classList.add("fade-out");
      setTimeout(() => staticLoader.remove(), 800);
    }

    const handleLoad = () => {
      // Small delay for smooth transition even on fast networks
      setTimeout(() => {
        setLoading(false);
      }, 800);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAFAF7]"
        >
          {/* Decorative Rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-64 h-64 border border-[#7C8C5C]/20 rounded-full"
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute w-96 h-96 border border-[#2B2B2B]/10 rounded-full"
          />

          <div className="relative flex flex-col items-center">
            {/* Logo Box */}
            <motion.div
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                type: "spring",
                stiffness: 100
              }}
              className="w-20 h-20 bg-[#7C8C5C] rounded-[24px] flex items-center justify-center shadow-2xl mb-8 relative z-10"
            >
              <span className="text-white font-black text-3xl uppercase tracking-tighter">{initials}</span>

              {/* Spinning border effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-8px] border-2 border-t-[#7C8C5C] border-r-transparent border-b-transparent border-l-transparent rounded-[32px] opacity-40"
              />
            </motion.div>

            {/* Brand Text */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl font-black text-[#2B2B2B] tracking-[0.3em] uppercase"
              >
                {siteName}
              </motion.h1>
            </div>

            {/* Progress Bar */}
            <div className="w-32 h-[2px] bg-[#E8DCC8] mt-6 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-[#7C8C5C]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#7C8C5C]/60"
            >
              Excellence in every step
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
