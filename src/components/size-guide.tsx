"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Info, Footprints } from "lucide-react";
import sizeData from "@/lib/size-data.json";

export default function SizeGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7C8C5C] hover:text-[#2B2B2B] transition-colors group mb-4"
            >
                <Ruler className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                <span>View Size Guide</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-[#2B2B2B]/40 backdrop-blur-md"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#FAFAF7] rounded-[48px] shadow-2xl border border-[#E8DCC8] overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-[#E8DCC8] flex items-center justify-between bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#7C8C5C]/10 rounded-2xl flex items-center justify-center">
                                        <Ruler className="w-6 h-6 text-[#7C8C5C]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#2B2B2B] leading-none">Size <span className="text-[#7C8C5C]">Guide</span></h2>
                                        <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest mt-1">International Conversion Chart</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 bg-[#FAFAF7] border border-[#E8DCC8] rounded-full flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"
                                >
                                    <X className="w-5 h-5 text-[#2B2B2B]" />
                                </button>
                            </div>

                            {/* Table Container */}
                            <div className="flex-1 overflow-auto p-8 no-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Size Table */}
                                    <div className="lg:col-span-2">
                                        <div className="overflow-x-auto rounded-3xl border border-[#E8DCC8] bg-white shadow-sm overflow-hidden">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-[#7C8C5C] text-white">
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">US Men</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">US Women</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">UK</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">EU</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Length (cm)</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">Length (in)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#E8DCC8]">
                                                    {sizeData.map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-[#FAFAF7] transition-colors">
                                                            <td className="px-6 py-4 text-xs font-black text-[#2B2B2B]">{row.usMen}</td>
                                                            <td className="px-6 py-4 text-xs font-bold text-[#555]">{row.usWomen}</td>
                                                            <td className="px-6 py-4 text-xs font-bold text-[#555]">{row.uk}</td>
                                                            <td className="px-6 py-4 text-xs font-bold text-[#555]">{row.eu}</td>
                                                            <td className="px-6 py-4 text-xs font-bold text-[#7C8C5C]">{row.cm}</td>
                                                            <td className="px-6 py-4 text-xs font-bold text-[#7C8C5C]">{row.inches}"</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Measuring Tips */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-[32px] border border-[#E8DCC8] shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <Info className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-[#2B2B2B]">How to measure</h4>
                                            </div>
                                            <ul className="space-y-4">
                                                {[
                                                    { step: "1", text: "Place a piece of paper on the floor against a wall." },
                                                    { step: "2", text: "Stand on the paper with your heel touching the wall." },
                                                    { step: "3", text: "Mark the longest part of your foot on the paper." },
                                                    { step: "4", text: "Measure from the edge of the paper to the mark." }
                                                ].map((item, i) => (
                                                    <li key={i} className="flex gap-4">
                                                        <span className="flex-shrink-0 w-5 h-5 bg-[#FAFAF7] border border-[#E8DCC8] rounded-full flex items-center justify-center text-[10px] font-black text-[#7C8C5C]">
                                                            {item.step}
                                                        </span>
                                                        <p className="text-[11px] font-bold text-[#555] leading-relaxed">{item.text}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-[#7C8C5C] p-6 rounded-[32px] text-white overflow-hidden relative group">
                                            <Footprints className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-2">Pro Tip</h4>
                                            <p className="text-[11px] font-medium leading-relaxed opacity-90">
                                                Measure your feet in the afternoon because they swell during the day. If you are between sizes, we recommend choosing the larger one.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer/Close Button for Mobile */}
                            <div className="p-8 border-t border-[#E8DCC8] bg-white flex justify-center">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-10 py-4 bg-[#2B2B2B] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#7C8C5C] transition-all shadow-xl active:scale-95"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
