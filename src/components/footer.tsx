"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2B2B2B] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#7C8C5C] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="font-bold text-xl">SoleBazar</span>
            </div>
            <p className="text-gray-400">Branded soles, thrift prices.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#home"
                  className="hover:text-[#7C8C5C] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#shop"
                  className="hover:text-[#7C8C5C] transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-[#7C8C5C] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-[#7C8C5C] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="https://instagram.com/solebazar.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#7C8C5C] transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send?phone=923149784156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#7C8C5C] transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:solebazar21@gmail.com"
                  className="hover:text-[#7C8C5C] transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <a
            href="https://thekhubaib.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-center text-gray-400">
              © 2025 SoleBazar. Developed by Khubaib Shah.
            </p>
          </a>
        </div>
      </div>
    </footer>
  );
}
