"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: "primary" | "danger";
    loading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    confirmVariant = "primary",
    loading = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2B2B2B]/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden border border-[#E8DCC8]"
                >
                    <div className="p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-[#2B2B2B]">{title}</h3>
                            <p className="text-[#555] font-bold text-sm leading-relaxed uppercase tracking-wider">
                                {message}
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-[#555] bg-gray-50 border border-[#E8DCC8] hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl transition-all disabled:opacity-50 ${confirmVariant === 'danger'
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                        : 'bg-[#7C8C5C] hover:bg-[#5D6B44] shadow-[#7C8C5C]/20'
                                    }`}
                            >
                                {loading ? "Processing..." : confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
