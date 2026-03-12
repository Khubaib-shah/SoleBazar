"use client";

import { SessionProvider } from "next-auth/react";
import LenisProvider from "./lenis-provider";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider refetchOnWindowFocus={false}>
            <Toaster position="top-right" />
            <LenisProvider>
                {children}
            </LenisProvider>
        </SessionProvider>
    );
}
