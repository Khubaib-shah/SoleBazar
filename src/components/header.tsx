"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";

import { useSettings } from "@/hooks/use-settings";
import { fetcher } from "@/lib/fetcher";
import { getInitials } from "@/lib/utils";

export default function Header() {
  const { settings } = useSettings();
  const initials = getInitials(settings?.siteName || "SoleBazar");
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const searchParams = useSearchParams();
  const pathname = usePathname();

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

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const sections = ["home", "shop", "about", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isActive = (label: string) => {
    const gender = searchParams.get("gender");
    const isProductsPage = pathname === "/products";

    if (label === "Home") return !isProductsPage && activeSection === "home";
    if (label === "Men") return (isProductsPage || activeSection === "shop") && gender === "Men";
    if (label === "Women") return (isProductsPage || activeSection === "shop") && gender === "Women";
    if (label === "Shop") return isProductsPage || (activeSection === "shop" && !gender);
    if (label === "About") return !isProductsPage && activeSection === "about";
    if (label === "Contact") return !isProductsPage && activeSection === "contact";
    return false;
  };

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Men", href: "/products?gender=Men" },
    { label: "Women", href: "/products?gender=Women" },
    { label: "Shop", href: "/products" },
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
              <span className="text-white font-black text-lg uppercase">{initials}</span>
            </motion.div>
            <span className="font-black text-2xl text-[#2B2B2B] tracking-tight group-hover:text-[#7C8C5C] transition-colors">
              {settings?.siteName || "SoleBazar"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.label);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`group relative text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? "text-[#7C8C5C]" : "text-[#2B2B2B]/60 hover:text-[#2B2B2B]"
                    }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#7C8C5C] origin-right transition-transform duration-500 ${active ? "scale-x-100 origin-left" : "scale-x-0 group-hover:scale-x-100 group-hover:origin-left"
                    }`}></span>
                </Link>
              );
            })}

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
                {navLinks.map((link) => {
                  const active = isActive(link.label);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`text-lg font-black flex items-center justify-between group transition-colors duration-300 ${active ? "text-[#7C8C5C]" : "text-[#2B2B2B]"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                      <motion.div
                        animate={{ scale: active ? 1.5 : 1 }}
                        className={`w-2 h-2 rounded-full transition-colors ${active ? "bg-[#7C8C5C]" : "bg-[#E8DCC8] group-hover:bg-[#7C8C5C]"
                          }`}
                      ></motion.div>
                    </Link>
                  );
                })}

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
