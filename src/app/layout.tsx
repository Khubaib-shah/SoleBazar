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
    title: {
      default: `${siteName} | Original Branded Thrift Shoes in Pakistan`,
      template: `%s | ${siteName} Pakistan`
    },
    description: siteDescription,
    keywords: [
      "shoes", "sneakers", "thrift store pakistan", "branded shoes pakistan",
      "nike pakistan", "adidas pakistan", "thrift shoes karachi",
      "pre-loved sneakers lahore", "original branded shoes price in pakistan",
      "second hand original shoes", "solebazar", "online shoe store pakistan"
    ],
    metadataBase: new URL("https://sole-bazar.vercel.app"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${siteName} | Premium Branded Thrift Shoes Pakistan`,
      description: siteDescription,
      url: "https://sole-bazar.vercel.app",
      siteName: siteName,
      images: [
        {
          url: "/metaimage.png",
          width: 1200,
          height: 630,
          alt: `${siteName} - Best Thrift Shoes in Pakistan`,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Premium Branded Thrift Shoes Pakistan`,
      description: siteDescription,
      images: ["/metaimage.png"],
    },
    icons: {
      icon: "/metaimage.png",
      apple: "/apple-icon.png",
    },
    verification: {
      google: "google-site-verification-placeholder",
      yandex: "yandex-verification-placeholder",
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.className} antialiased`}
        cz-shortcut-listen="true"
      >
        <Providers>
          {/* <Preloader /> */}
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
          <BackToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

import AnalyticsTracker from "@/components/analytics-tracker";
import { Suspense } from "react";
