"use client";
import { Suspense } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import About from "@/components/about";
import Shop from "@/components/shop";
import Featured from "@/components/featured";
import Testimonials from "@/components/testimonials";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <Suspense fallback={<div className="h-20 bg-transparent" />}>
        <Header />
      </Suspense>
      <Hero />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Shop...</div>}>
        <Shop
          featuredOnly={true}
          title="Featured Collection"
          subtitle="Hand-picked premium sneakers from our latest inventory. Selected for quality and style."
        />
      </Suspense>
      <Featured />
      <Testimonials />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
