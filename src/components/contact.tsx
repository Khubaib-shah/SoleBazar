"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Instagram, Send, MapPin, Phone, Loader2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "Buying Inquiries", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "Buying Inquiries", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp",
      value: "+92 314 9784156",
      href: "https://api.whatsapp.com/send?phone=923149784156",
      color: "bg-green-50 text-green-600",
      description: "Chat with us instantly"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "solebazar21@gmail.com",
      href: "mailto:solebazar21@gmail.com",
      color: "bg-blue-50 text-blue-600",
      description: "Send us an inquiry"
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      title: "Instagram",
      value: "@solebazar.pk",
      href: "https://instagram.com/solebazar.pk",
      color: "bg-pink-50 text-pink-600",
      description: "Follow our collection"
    }
  ];

  return (
    <section id="contact" className="py-32 bg-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-40 -left-20 w-80 h-80 bg-[#7C8C5C]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 -right-20 w-80 h-80 bg-[#E8DCC8]/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#7C8C5C] font-black text-[10px] uppercase tracking-[0.4em] mb-4"
          >
            Connect With Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-[#2B2B2B] leading-tight"
          >
            Let's Start a <span className="text-[#7C8C5C]">Conversation</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-black text-[#2B2B2B] mb-4">Direct Channels</h3>
                <p className="text-sm text-[#555] font-medium leading-relaxed">Have a question about a specific pair or want to sell your collection? Reach out through our verified channels for quick assistance, expert guidance, and secure communication with our dedicated sneaker support team.
                </p>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method, idx) => (
                  <motion.a
                    key={idx}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="flex items-center gap-6 p-6 bg-[#FAFAF7] border border-[#E8DCC8]/50 rounded-[32px] hover:bg-white hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#999] mb-1">{method.title}</p>
                      <p className="text-sm font-black text-[#2B2B2B]">{method.value}</p>
                      <p className="text-[10px] font-bold text-[#7C8C5C] mt-1">{method.description}</p>
                    </div>
                  </motion.a>
                ))}
              </div>


            </motion.div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-[48px] shadow-xl border border-[#E8DCC8]/30 relative"
            >
              <div className="mb-4">
                <h3 className="text-3xl font-black text-[#2B2B2B] mb-2">Send a Message</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C8C5C]">Responses within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all shadow-inner"
                      placeholder="e.g. Ali Ahmed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all shadow-inner"
                      placeholder="ali@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all appearance-none"
                  >
                    <option value="Buying Inquiries">Buying Inquiries</option>
                    <option value="Selling Collection">Selling Collection</option>
                    <option value="Order Support">Order Support</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Your Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all resize-none shadow-inner"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 active:scale-95 ${submitted
                    ? "bg-green-500 text-white"
                    : "bg-[#7C8C5C] hover:bg-[#6B7A4F] text-white"
                    }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : submitted ? (
                    <>Message Sent Successfully!</>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Success Overlay Glow (Optional) */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-[48px] pointer-events-none border-4 border-green-500/20"
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Physical Location Pin (Optional aesthetic touch) */}
        <div className="mt-6 p-4 bg-[#2B2B2B] rounded-[20px] text-white space-y-2 shadow-xl">
          <div className="flex items-center gap-4">
            <div className=" bg-[#7C8C5C] rounded-xl flex items-center justify-center p-2">
              <MapPin className="size-5 text-white" />
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs">Origin</h4>
              <p className="text-sm font-medium text-white/70 leading-relaxed">Based in Karachi, Pakistan, we proudly serve sneaker enthusiasts across the country with a carefully curated selection of authentic footwear. Our mission is to bring together style, comfort, and originality by offering sneakers that are handpicked for their quality, design, and cultural relevance.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
