"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

export default function ProductViewTracker({ productId }: { productId: string }) {
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        trackEvent({
            eventType: "product_view",
            productId
        });
    }, [productId, trackEvent]);

    return null;
}
