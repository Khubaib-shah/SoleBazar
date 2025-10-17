import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SoleBazar | Thrift Shoes Pakistan | Branded Shoes Karachi",
  description:
    "Branded soles, thrift prices. Discover high-quality, affordable branded shoes from Nike, Adidas, Puma and more.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
        cz-shortcut-listen="true"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
