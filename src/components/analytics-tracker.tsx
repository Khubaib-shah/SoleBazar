"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        // Track page view on route change
        trackEvent({
            eventType: "page_view",
            page: window.location.pathname + window.location.search
        });
    }, [pathname, searchParams, trackEvent]);

    return null;
}
