import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SoleBazar | Thrift Shoes Pakistan | Branded Shoes Karachi",
  description:
    "Branded soles, thrift prices. Discover high-quality, affordable branded shoes from Nike, Adidas, Puma and more in Pakistan.",
  keywords: ["shoes", "sneakers", "thrift", "pakistan", "branded", "nike", "adidas", "puma", "karachi"],
  openGraph: {
    title: "SoleBazar | Premium Thrift Sneakers Pakistan",
    description: "Discover authentic branded shoes at thrift prices. Hand-curated collection from global brands.",
    url: "https://solebazar.com",
    siteName: "SoleBazar",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "SoleBazar Collection",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoleBazar | Premium Thrift Sneakers Pakistan",
    description: "Authentic branded shoes at thrift prices.",
    images: ["/hero.png"],
  },
  icons: {
    icon: "/placeholder-logo.png",
  }
};

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
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
