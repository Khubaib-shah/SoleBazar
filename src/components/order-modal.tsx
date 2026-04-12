"use client";

import { useState } from "react";
import {
  X,
  MessageCircle,
  Loader2,
  ShieldCheck,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAnalytics } from "@/hooks/use-analytics";
import { useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  brand: { name: string };
  slug: string;
  images?: { url: string }[];
}

export default function OrderModal({
  product,
  selectedSize,
  selectedColor,
}: {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
  });
  const { trackEvent } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.address) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: [
            {
              productId: product.id,
              size: selectedSize,
              color: selectedColor,
              quantity: 1,
            },
          ],
        }),
      });

      if (res.ok) {
        const order = await res.json();

        // Track purchase
        trackEvent({
          eventType: "purchase",
          productId: product.id
        });

        toast.success("Order recorded! Redirecting to WhatsApp...");

        // Construct WhatsApp Message
        const message =
          `*New Order Request*\n\n` +
          `*Order ID:* #${order.id.slice(-6).toUpperCase()}\n` +
          `*Product:* ${product.name}\n` +
          `*Brand:* ${product.brand.name}\n` +
          `*Size:* ${selectedSize || "N/A"}\n` +
          `*Price:* PKR ${product.price.toLocaleString()}\n\n` +
          `*Customer Info:*\n` +
          `Name: ${formData.customerName}\n` +
          `Phone: ${formData.phone}\n` +
          `Address: ${formData.address}\n\n` +
          `Link: ${window.location.origin}/product/${product.slug}`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=923162126865&text=${encodeURIComponent(message)}`;

        setIsOpen(false);
        window.open(whatsappUrl, "_blank");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          trackEvent({
            eventType: "checkout_visit",
            productId: product.id
          });
        }}
        className="flex items-center justify-center gap-4 bg-[#2B2B2B] hover:bg-[#7C8C5C] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl hover:shadow-[#7C8C5C]/40 active:scale-95 w-full"
      >
        <MessageCircle className="w-5 h-5" />
        Order Now via WhatsApp
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-[#2B2B2B]/80 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row">
            {/* Left Decor / Summary */}
            <div className="hidden md:flex md:w-60 bg-[#FAFAF7] border-r border-[#E8DCC8] p-8 flex-col items-center text-center">
              <div className="w-full flex-1 flex flex-col items-center justify-center">
                <div className="w-full aspect-[4/5] bg-white rounded-[32px] overflow-hidden shadow-xl border border-[#E8DCC8] group p-1 mb-8">
                  <img
                    src={product.images?.[0]?.url || "https://placehold.co/600x600/7C8C5C/FFFFFF?text=SoleBazar"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-[28px] group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex flex-col gap-y-4 justify-between items-center w-full h-full">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] font-black uppercase text-[#999] tracking-[0.2em]">
                      Selected Item
                    </p>
                    <p className="font-black text-sm text-[#2B2B2B] leading-tight px-2">
                      {product.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-4 border-t border-[#E8DCC8]/50">
                    <p className="text-[10px] font-black uppercase text-[#999] tracking-[0.2em]">
                      Total Price
                    </p>
                    <p className="font-black text-lg text-[#7C8C5C]">
                      PKR {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="flex-1 p-8 sm:p-12">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-[#2B2B2B] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-[#2B2B2B] mb-2">
                  Order Details
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#7C8C5C]">
                  Secure Checkout | Cash on Delivery
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                    placeholder="e.g. Ali Ahmed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all"
                    placeholder="03xx xxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">
                    Shipping Address
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] font-bold text-sm transition-all resize-none"
                    rows={3}
                    placeholder="Your complete address for delivery..."
                  />
                </div>

                <div className="pt-4 space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#7C8C5C] hover:bg-[#A3B38A] text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MessageCircle className="w-5 h-5" />
                    )}
                    Place Order & Go to WhatsApp
                  </button>

                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#E8DCC8]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#7C8C5C]" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#999]">
                        Verified Product
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#7C8C5C]" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#999]">
                        Pay on Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
