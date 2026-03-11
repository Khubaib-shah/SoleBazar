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

    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <Header />

            {/* Product Hero / Breadcrumb Section */}
            <div className="bg-[#F5EBDC] py-12 border-b border-[#E8DCC8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C8C5C] mb-4">
                        <Link href="/" className="hover:text-[#2B2B2B] flex items-center gap-1">
                            <Home className="w-3 h-3" /> Home
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <Link href="/#shop" className="hover:text-[#2B2B2B] flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" /> Shop
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <span className="text-[#2B2B2B]">{product.name}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-black text-[#2B2B2B]">{product.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[60px] overflow-hidden shadow-2xl aspect-[4/5] relative border border-[#E8DCC8]">
                            <ClientCarousel images={product.images.map(img => img.url)} />
                            {product.compareAt && (
                                <div className="absolute top-10 left-10 bg-[#7C8C5C] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl z-10">
                                    Special Offer
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2">
                            {product.images.map((img, idx) => (
                                <div key={img.id} className="relative w-28 aspect-[4/5] rounded-[24px] overflow-hidden border-2 border-[#E8DCC8] flex-shrink-0 cursor-pointer hover:border-[#7C8C5C] transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                    <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:pt-10">
                        <ProductDetailContent product={product as any} />
                    </div>
                </div>

                {/* Related Products Section */}
                {related.length > 0 && (
                    <div className="mt-40">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <p className="text-[#7C8C5C] font-black text-[10px] uppercase tracking-[0.3em] mb-4">Complete Your Look</p>
                                <h2 className="text-4xl font-black text-[#2B2B2B]">You Might <span className="text-[#7C8C5C]">Also Like</span></h2>
                            </div>
                            <Link href="/#shop" className="text-xs font-black uppercase tracking-widest text-[#7C8C5C] flex items-center gap-3 group border-b-2 border-transparent hover:border-[#7C8C5C] pb-2 transition-all">
                                View Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {related.map((rel) => (
                                <Link key={rel.id} href={`/product/${rel.slug}`} className="group h-full">
                                    <div className="bg-white rounded-[48px] overflow-hidden shadow-sm border border-[#E8DCC8] group-hover:shadow-3xl transition-all duration-700 transform group-hover:-translate-y-3 h-full flex flex-col">
                                        <div className="aspect-[4/5] relative overflow-hidden bg-[#F5EBDC]">
                                            <img
                                                src={rel.images?.[0]?.url || "/placeholder.svg"}
                                                alt={rel.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        </div>
                                        <div className="p-10 flex-1 flex flex-col">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#7C8C5C] mb-3">{rel.brand.name}</p>
                                            <h3 className="text-lg font-black text-[#2B2B2B] group-hover:text-[#7C8C5C] transition-colors leading-tight">{rel.name}</h3>
                                            <div className="mt-auto pt-6 flex items-center justify-between">
                                                <p className="text-xl font-black text-[#2B2B2B]">PKR {rel.price.toLocaleString()}</p>
                                                <div className="w-10 h-10 bg-[#FAFAF7] rounded-xl flex items-center justify-center group-hover:bg-[#7C8C5C] group-hover:text-white transition-all shadow-inner">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
