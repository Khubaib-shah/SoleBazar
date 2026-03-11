import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ChevronRight,
    ArrowRight,
    Home,
    ShoppingBag
} from "lucide-react";
import ClientCarousel from "@/components/client-carousel";
import ProductDetailContent from "@/components/product-detail-content";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

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
            images: { orderBy: { order: "asc" } }
        },
        take: 4
    });

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <Header />

            {/* Product Hero / Breadcrumb Section */}
            <div className="bg-[#F5EBDC] py-8 border-b border-[#E8DCC8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#7C8C5C] mb-3">
                        <Link href="/" className="hover:text-[#2B2B2B] flex items-center gap-1">
                            <Home className="w-2.5 h-2.5" /> Home
                        </Link>
                        <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
                        <Link href="/#shop" className="hover:text-[#2B2B2B] flex items-center gap-1">
                            <ShoppingBag className="w-2.5 h-2.5" /> Shop
                        </Link>
                        <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
                        <span className="text-[#2B2B2B]">{product.name}</span>
                    </nav>
                    <h1 className="text-3xl md:text-4xl font-black text-[#2B2B2B]">{product.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl aspect-[4/5] relative border border-[#E8DCC8]">
                            <ClientCarousel images={product.images.map(img => img.url)} />
                            {product.compareAt && (
                                <div className="absolute top-8 left-8 bg-[#7C8C5C] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-10">
                                    Special Offer
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                            {product.images.map((img) => (
                                <div key={img.id} className="relative w-24 aspect-[4/5] rounded-[20px] overflow-hidden border-2 border-[#E8DCC8] flex-shrink-0 cursor-pointer hover:border-[#7C8C5C] transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                    <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:pt-6">
                        <ProductDetailContent product={product as any} />
                    </div>
                </div>

                {/* Related Products Section */}
                {related.length > 0 && (
                    <div className="mt-24">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                            <div>
                                <p className="text-[#7C8C5C] font-black text-[9px] uppercase tracking-[0.3em] mb-3">Complete Your Look</p>
                                <h2 className="text-3xl font-black text-[#2B2B2B]">You Might <span className="text-[#7C8C5C]">Also Like</span></h2>
                            </div>
                            <Link href="/#shop" className="text-[10px] font-black uppercase tracking-widest text-[#7C8C5C] flex items-center gap-2 group border-b-2 border-transparent hover:border-[#7C8C5C] pb-1.5 transition-all">
                                View Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {related.map((rel) => (
                                <ProductCard key={rel.id} product={rel as any} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
