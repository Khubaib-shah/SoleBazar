"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Shop", href: "/#shop" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-[#FAFAF7]/90 backdrop-blur-xl border-b border-[#E8DCC8]/50 py-3 shadow-md"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-10 h-10 bg-[#7C8C5C] rounded-xl flex items-center justify-center shadow-lg transition-all"
            >
              <span className="text-white font-black text-lg uppercase">SB</span>
            </motion.div>
            <span className="font-black text-2xl text-[#2B2B2B] tracking-tight group-hover:text-[#7C8C5C] transition-colors">
              SoleBazar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-[12px] font-black uppercase tracking-[0.2em] text-[#2B2B2B]/60 hover:text-[#2B2B2B] transition-colors"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#7C8C5C] origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500"></span>
              </Link>
            ))}

            <div className="h-6 w-px bg-[#E8DCC8] mx-2 opacity-50"></div>

            {!isLoading ? (
              isAuthenticated ? (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2B2B2B] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#7C8C5C] transition-all shadow-lg active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-6 py-2.5 border-2 border-[#2B2B2B] text-[#2B2B2B] text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#2B2B2B] hover:text-white transition-all active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )
            ) : (
              <div className="w-24 h-10 bg-[#E8DCC8]/20 animate-pulse rounded-xl"></div>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-4">
            {!isLoading && !isAuthenticated && (
              <Link href="/admin/login" className="text-[#2B2B2B] p-2 hover:text-[#7C8C5C] transition-colors">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            <button
              className="p-2.5 bg-white rounded-xl shadow-sm border border-[#E8DCC8] hover:border-[#7C8C5C] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <X className="w-6 h-6 text-[#2B2B2B]" />
                  ) : (
                    <Menu className="w-6 h-6 text-[#2B2B2B]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden overflow-hidden bg-white mt-4 rounded-3xl border border-[#E8DCC8] shadow-2xl p-6"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-black text-[#2B2B2B] flex items-center justify-between group"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                    <motion.div
                      whileHover={{ scale: 1.5 }}
                      className="w-2 h-2 bg-[#E8DCC8] group-hover:bg-[#7C8C5C] rounded-full transition-colors"
                    ></motion.div>
                  </Link>
                ))}

                <div className="h-px bg-[#E8DCC8] w-full mt-4 opacity-50"></div>

                {!isLoading && (
                  isAuthenticated ? (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center justify-center gap-3 w-full py-4 bg-[#2B2B2B] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/admin/login"
                      className="flex items-center justify-center gap-3 w-full py-4 border-2 border-[#2B2B2B] text-[#2B2B2B] text-[10px] font-black uppercase tracking-widest rounded-2xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Account Login
                    </Link>
                  )
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
