import Header from "@/components/header";
import Shop from "@/components/shop";
import Footer from "@/components/footer";
import { Suspense } from "react";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF7]">
            <Suspense fallback={<div className="h-20 bg-transparent" />}>
                <Header />
            </Suspense>

            {/* Banner for All Products */}
            <div className="bg-[#2B2B2B] py-12 md:py-20 text-white relative overflow-hidden z-0">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#7C8C5C,transparent)] transform scale-150"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-[#7C8C5C] font-black text-[10px] uppercase tracking-[0.4em] mb-4">The Complete Inventory</p>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6">ALL <span className="text-[#7C8C5C]">PRODUCTS</span></h1>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
                        Explore our entire collection of authentic branded sneakers. From rare vintage finds to the latest lifestyle releases.
                    </p>
                </div>
            </div>

            <Suspense fallback={<div className="min-vh-100 flex items-center justify-center">Loading Shop...</div>}>
                <Shop
                    featuredOnly={false}
                    title="Full Catalog"
                    subtitle="Browse every pair available at SoleBazar. Filter by brand, size, or condition to find your perfect match."
                />
            </Suspense>

            <Footer />
        </main>
    );
}
