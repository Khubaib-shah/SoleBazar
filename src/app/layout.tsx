import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/components/providers";
import BackToTop from "@/components/back-to-top";
import Preloader from "@/components/preloader";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.setting.findFirst();
  const siteName = settings?.siteName || "SoleBazar";
  const siteDescription = settings?.siteDescription || "Branded soles, thrift prices. Discover high-quality, affordable branded shoes from Nike, Adidas, Puma and more in Pakistan.";

  return {
    title: `${siteName} | Premium Thrift Shoes Pakistan`,
    description: siteDescription,
    keywords: ["shoes", "sneakers", "thrift", "pakistan", "branded", "nike", "adidas", "puma", "karachi"],
    openGraph: {
      title: `${siteName} | Premium Thrift Sneakers Pakistan`,
      description: siteDescription,
      url: "https://sole-bazar.vercel.app",
      siteName: siteName,
      images: [
        {
          url: "/metaimage.png",
          width: 1200,
          height: 630,
          alt: `${siteName} Collection`,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Premium Thrift Sneakers Pakistan`,
      description: siteDescription,
      images: ["/metaimage.png"],
    },
    icons: {
      icon: "/metaimage.png",
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.setting.findFirst();
  const siteName = settings?.siteName || "SoleBazar";
  const initials = getInitials(siteName);

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.className} antialiased`}
        cz-shortcut-listen="true"
      >
        <Providers>
          {/* Simplified static preloader as a background cover */}
          <div id="immediate-preloader" className="static-preloader-wrapper bg-white dark:bg-gray-900 fixed inset-0 z-[9999]">
          </div>
          <Preloader />
          {children}
          <BackToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
