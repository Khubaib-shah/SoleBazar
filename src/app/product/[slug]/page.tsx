import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    TrendingUp,
    Clock,
    ArrowRight
} from "lucide-react";
import ClientCarousel from "@/components/client-carousel";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            brand: true,
            category: true,
            images: { orderBy: { order: "asc" } },
        },
    });

    if (!product) {
        notFound();
    }

    // Related products
    const related = await prisma.product.findMany({
        where: {
            brandId: product.brandId,
            id: { not: product.id },
        },
        include: {
            brand: true,
            images: { take: 1, orderBy: { order: "asc" } }
        },
        take: 4
    });

    const sizes = JSON.parse(product.sizes || "[]");
    const colors = JSON.parse(product.colors || "[]");

    const whatsappMessage = `Hi! I'm interested in the ${product.name} (${product.brand.name}) - Condition: ${product.condition}. Link: ${process.env.NEXTAUTH_URL}/product/${product.slug}`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=923162126865&text=${encodeURIComponent(
        whatsappMessage
    )}`;

    return (
        <div className="min-h-screen bg-[#FAFAF7] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-[#555] font-bold uppercase tracking-wider mb-10">
                    <Link href="/" className="hover:text-[#7C8C5C]">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/#shop" className="hover:text-[#7C8C5C]">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#2B2B2B]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl aspect-[4/5] relative">
                            <ClientCarousel images={product.images.map(img => img.url)} />
                        </div>

                        {/* Thumbnail hints / Gallery status */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {product.images.map((img, idx) => (
                                <div key={img.id} className="relative w-24 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#E8DCC8] flex-shrink-0 cursor-pointer hover:border-[#7C8C5C] transition-colors shadow-sm">
                                    <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-[#7C8C5C] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                                    {product.brand.name}
                                </span>
                                <span className="text-[10px] text-[#555] font-black uppercase tracking-widest bg-white/50 px-4 py-1.5 rounded-full border border-[#E8DCC8]">
                                    {product.condition}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#2B2B2B] mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-4 mb-4">
                                <p className="text-4xl font-black text-[#7C8C5C]">
                                    <span className="text-xl mr-2">PKR</span>
                                    {product.price.toLocaleString()}
                                </p>
                                {product.compareAt && (
                                    <p className="text-xl text-gray-400 line-through font-bold">
                                        PKR {product.compareAt.toLocaleString()}
                                    </p>
                                )}
                            </div>
                            <p className="text-lg text-[#555] leading-relaxed mb-8 max-w-xl">
                                {product.description || "No description provided for this product. Premium quality footwear curated from top brands."}
                            </p>
                        </div>

                        {/* Sizes & Attributes */}
                        <div className="mb-10 space-y-8">
                            {sizes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-[#2B2B2B] uppercase tracking-[0.2em] mb-4">Available Sizes</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map((size: string) => (
                                            <button key={size} className="w-14 h-14 bg-white border-2 border-[#E8DCC8] hover:border-[#7C8C5C] rounded-2xl flex items-center justify-center font-black text-[#2B2B2B] transition-all hover:scale-110 shadow-sm active:scale-95">
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-[#2B2B2B] uppercase tracking-[0.2em] mb-4">Colors</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((color: string) => (
                                            <span key={color} className="px-5 py-2.5 bg-white border-2 border-[#E8DCC8] rounded-full text-xs font-black text-[#555] uppercase tracking-widest shadow-sm">
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto space-y-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-4 bg-[#2B2B2B] hover:bg-[#7C8C5C] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl hover:shadow-[#7C8C5C]/40 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <MessageCircle className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Purchase via WhatsApp</span>
                            </a>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-3xl border border-[#E8DCC8] flex items-center gap-4">
                                    <ShieldCheck className="w-6 h-6 text-[#7C8C5C]" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#555]">Authenticity</p>
                                        <p className="text-xs font-bold text-[#2B2B2B]">100% Guaranteed</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-[#E8DCC8] flex items-center gap-4">
                                    <Clock className="w-6 h-6 text-[#7C8C5C]" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#555]">Fast Delivery</p>
                                        <p className="text-xs font-bold text-[#2B2B2B]">Karachi 24h, PK 2-3d</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-[#2B2B2B] mb-4">You might also like</h2>
                                <p className="text-[#555]">Curated selection of similar sneakers from {product.brand.name}.</p>
                            </div>
                            <Link href="/#shop" className="text-sm font-black uppercase tracking-widest text-[#7C8C5C] flex items-center gap-2 group">
                                See More <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {related.map((rel) => (
                                <Link key={rel.id} href={`/product/${rel.slug}`} className="group h-full">
                                    <div className="bg-white rounded-[40px] overflow-hidden shadow-lg border border-[#E8DCC8]/30 group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 h-full flex flex-col">
                                        <div className="aspect-[4/5] relative overflow-hidden bg-[#F5EBDC]">
                                            <img
                                                src={rel.images?.[0]?.url || "/placeholder.svg"}
                                                alt={rel.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-8">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#7C8C5C] mb-2">{rel.brand.name}</p>
                                            <h3 className="font-bold text-[#2B2B2B] group-hover:text-[#7C8C5C] transition-colors">{rel.name}</h3>
                                            <p className="text-xl font-black text-[#2B2B2B] mt-4">PKR {rel.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
