"use client";

import { motion } from "framer-motion";
import { ShieldCheck, History, Heart, Globe, Award } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

const DecorativeTrace = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Large animated ring */}
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-1/2 w-full text-[#7C8C5C]/10"
      viewBox="0 0 200 200"
    ><circle
        cx="100"
        cy="100"
        r="90"
        stroke="#7c8c5c75"
        stroke-width="3"
        stroke-dasharray="12 8"
        fill="none"
      /></motion.svg>

    {/* Primary Trace Path */}
    {/* <svg className="absolute top-20 right-20 w-[300px] h-[300px] text-[#7C8C5C]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M20 180Q80 150 100 100T180 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      <motion.circle
        cx="180" cy="20" r="4"
        fill="currentColor"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.5, duration: 0.5 }}
      />
    </svg> */}

    {/* Secondary Bottom Trace */}
    {/* <svg className="absolute bottom-10 left-10 w-[200px] h-[200px] text-[#E8DCC8]" viewBox="0 0 100 100">
      <motion.path
        d="M0 80Q30 70 50 40T100 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.5 }}
      />
    </svg> */}
  </div>
);

export default function About() {
  const { settings } = useSettings();
  const siteName = settings?.siteName || "SoleBazar";

  const stats = [
    {
      icon: <Award className="w-5 h-5" />,
      value: "1000+",
      label: "Authentic Pairs",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      value: "500+",
      label: "Style Lovers",
      color: "bg-red-50 text-red-600"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      value: "Karachi",
      label: "Home Base",
      color: "bg-[#7C8C5C]/10 text-[#7C8C5C]"
    }
  ];

  return (
    <section id="about" className="py-32 bg-[#FAFAF7] overflow-hidden relative">
      <DecorativeTrace />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Image with decorative frame */}
            <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white aspect-[4/5]">
              <img
                src="/our_story_sneakers.png"
                alt={`${siteName} Curated Collection`}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
              />

              {/* Overlay Glass Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-xs border border-white/30 p-8 rounded-[32px] shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#7C8C5C] rounded-2xl flex items-center justify-center shadow-lg">
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-widest">Since 2024</p>
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">Curating the best soles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blobbies with floating animation */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 w-64 h-64 bg-[#7C8C5C] rounded-full opacity-30 blur-3xl z-0"
            ></motion.div>
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 -right-12 w-80 h-80 bg-[#E8DCC8] rounded-full opacity-40 blur-3xl z-0"
            ></motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <p className="text-[#7C8C5C] font-black text-[10px] uppercase tracking-[0.4em] mb-4">Behind the Brand</p>
              <h2 className="text-5xl lg:text-6xl font-black text-[#2B2B2B] leading-[1.1] mb-8">
                Our Story <span className="text-[#7C8C5C]">& Mission</span>
              </h2>

              <div className="space-y-4">
                <p className="text-lg text-[#555] font-medium leading-relaxed">
                  {siteName} was born from a passion for finding hidden gems in the
                  world of thrifted sneakers. Founded by <span className="text-[#2B2B2B] font-black">Khubaib Shah</span> in Karachi, we combine streetwear culture with the thrill of discovery.
                </p>
                <div className="h-px w-20 bg-[#E8DCC8]"></div>
                <p className="text-base text-[#555] leading-relaxed">
                  We believe that everyone deserves access to premium branded
                  footwear without breaking the bank. Each shoe is carefully
                  authenticated, ensuring you get the best quality at prices that actually make sense.
                </p>
              </div>
            </div>

            {/* Premium Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white p-6 rounded-[32px] border border-[#E8DCC8]/50 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                    {stat.icon}
                  </div>
                  <p className="text-xl font-black text-[#2B2B2B] leading-none mb-1">{stat.value}</p>
                  <p className="text-[9px] font-bold text-[#999] uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Authenticity Badge */}
            <div className="mt-6 flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-dashed border-[#7C8C5C]/30 w-full">
              <ShieldCheck className="size-8 text-[#7C8C5C]" />
              <p className="text-[14px] font-black uppercase tracking-widest text-[#2B2B2B]">
                100% Authenticity Guaranteed on every sale
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
