"use client";
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
      <Header />
      <Hero />
      <Shop />
      <Featured />
      <Testimonials />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
