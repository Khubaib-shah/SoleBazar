"use client";

import type React from "react";

import { useState } from "react";
import { Mail, MessageCircle, Instagram } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-[#2B2B2B] mb-12 text-center">
          Get in Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-[#2B2B2B] mb-8">
              Contact Us
            </h3>

            <div className="space-y-6">
              {/* WhatsApp */}
              <a
                href="https://api.whatsapp.com/send?phone=923149784156"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-[#F5EBDC] rounded-lg hover:bg-[#E8DCC8] transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-[#7C8C5C] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#2B2B2B]">WhatsApp</p>
                  <p className="text-[#555]">+92 314 9784156</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:solebazar21@gmail.com"
                className="flex items-start gap-4 p-4 bg-[#F5EBDC] rounded-lg hover:bg-[#E8DCC8] transition-colors"
              >
                <Mail className="w-6 h-6 text-[#7C8C5C] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#2B2B2B]">Email</p>
                  <p className="text-[#555]">solebazar21@gmail.com</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/solebazar.pk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-[#F5EBDC] rounded-lg hover:bg-[#E8DCC8] transition-colors"
              >
                <Instagram className="w-6 h-6 text-[#7C8C5C] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#2B2B2B]">Instagram</p>
                  <p className="text-[#555]">@solebazar.pk</p>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-[#2B2B2B] mb-8">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2B2B2B] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E8DCC8] rounded-lg focus:outline-none focus:border-[#7C8C5C] focus:ring-2 focus:ring-[#7C8C5C]/20 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2B2B2B] mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-[#E8DCC8] rounded-lg focus:outline-none focus:border-[#7C8C5C] focus:ring-2 focus:ring-[#7C8C5C]/20 transition-all resize-none"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#7C8C5C] hover:bg-[#6B7A4F] text-white font-semibold py-3 rounded-lg transition-colors duration-300 cursor-pointer"
              >
                {submitted ? "✓ Message Sent!" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
