"use client";

import Link from "next/link";
import { Instagram, MessageCircle, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Shop", href: "/#shop" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "https://instagram.com/solebazar.pk", icon: <Instagram className="w-4 h-4" /> },
    { label: "WhatsApp", href: "https://api.whatsapp.com/send?phone=923149784156", icon: <MessageCircle className="w-4 h-4" /> },
    { label: "Email", href: "mailto:solebazar21@gmail.com", icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <footer className="bg-[#2B2B2B] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#7C8C5C] rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <span className="text-white font-black text-lg">SB</span>
              </div>
              <span className="font-black text-2xl tracking-tight text-white">SoleBazar</span>
            </Link>
            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Pakistan's premium sneaker marketplace. Curating authentic branded soles for the modern collector since 2024. Your style, delivered.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#7C8C5C] hover:bg-[#7C8C5C] transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C8C5C]">Navigation</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group relative inline-block text-lg font-bold text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {link.label}

                    <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#7C8C5C] origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action / Info */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C8C5C]">Join the Movement</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              Want to showcase your collection or looking for a specific drop? Our community is always open.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-[#7C8C5C] text-white rounded-2xl border border-white/10 transition-all duration-300 group text-xs font-black uppercase tracking-widest"
            >
              Get in Touch
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
              © {currentYear} SoleBazar Karachi. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Crafted by</span>
              <a
                href="https://thekhubaib.me"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#7C8C5C]"
              >
                Khubaib Shah
                <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-[#7C8C5C] origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
