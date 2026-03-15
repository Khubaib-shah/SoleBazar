import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { Suspense } from "react";
import ProductGallery from "@/components/product-gallery";
import ProductDetailContent from "@/components/product-detail-content";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import ProductViewTracker from "@/components/product-view-tracker";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
      images: { orderBy: { order: "asc" } },
    },
    take: 4,
  });

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <Suspense fallback={<div className="h-20 bg-transparent" />}>
        <Header />
      </Suspense>
      <ProductViewTracker productId={product.id} />

      {/* Product Hero / Breadcrumb Section */}
      <div className="bg-[#F5EBDC] py-8 border-b border-[#E8DCC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#7C8C5C] mb-3">
            <Link
              href="/"
              className="hover:text-[#2B2B2B] flex items-center gap-1"
            >
              <Home className="w-2.5 h-2.5" /> Home
            </Link>
            <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
            <Link
              href="/#shop"
              className="hover:text-[#2B2B2B] flex items-center gap-1"
            >
              <ShoppingBag className="w-2.5 h-2.5" /> Shop
            </Link>
            <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
            <span className="text-[#2B2B2B]">{product.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-[#2B2B2B]">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Image Gallery */}
          <ProductGallery 
            images={product.images} 
            showBadge={!!product.compareAt} 
          />

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
                <p className="text-[#7C8C5C] font-black text-[9px] uppercase tracking-[0.3em] mb-3">
                  Complete Your Look
                </p>
                <h2 className="text-3xl font-black text-[#2B2B2B]">
                  You Might <span className="text-[#7C8C5C]">Also Like</span>
                </h2>
              </div>
              <Link
                href="/#shop"
                className="text-[10px] font-black uppercase tracking-widest text-[#7C8C5C] flex items-center gap-2 group border-b-2 border-transparent hover:border-[#7C8C5C] pb-1.5 transition-all"
              >
                View Collection{" "}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
