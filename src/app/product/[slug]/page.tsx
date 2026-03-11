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
import ProductDetailContent from "@/components/product-detail-content";

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
                    <div>
                        <ProductDetailContent product={product as any} />
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
