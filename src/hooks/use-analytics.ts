"use client";

import { useEffect, useCallback } from "react";

interface TrackOptions {
    eventType: "page_view" | "product_view" | "product_click" | "add_to_cart" | "checkout_visit" | "purchase";
    productId?: string;
    page?: string;
}

export function useAnalytics() {
    const getSessionId = useCallback(() => {
        if (typeof window === "undefined") return "";
        
        let sessionId = localStorage.getItem("sb_analytics_session");
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem("sb_analytics_session", sessionId);
        }
        return sessionId;
    }, []);

    const trackEvent = useCallback(async (options: TrackOptions) => {
        try {
            const sessionId = getSessionId();
            const { eventType, productId, page } = options;

            await fetch("/api/analytics/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventType,
                    sessionId,
                    productId,
                    page: page || window.location.pathname,
                    userAgent: navigator.userAgent,
                    referrer: document.referrer
                }),
            });
        } catch (error) {
            // Silently fail for analytics to not break UX
            console.error("Analytics Error:", error);
        }
    }, [getSessionId]);

    return { trackEvent };
}
