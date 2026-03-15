import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get all product-related events
        const events = await prisma.analyticsEvent.findMany({
            where: {
                eventType: { in: ["product_view", "product_click", "add_to_cart"] },
                productId: { not: null }
            }
        });

        // Group by productId
        const productStatsMap: Record<string, any> = {};

        events.forEach(event => {
            const pid = event.productId as string;
            if (!productStatsMap[pid]) {
                productStatsMap[pid] = {
                    productId: pid,
                    views: 0,
                    clicks: 0,
                    addToCart: 0
                };
            }

            if (event.eventType === "product_view") productStatsMap[pid].views++;
            if (event.eventType === "product_click") productStatsMap[pid].clicks++;
            if (event.eventType === "add_to_cart") productStatsMap[pid].addToCart++;
        });

        const productStats = Object.values(productStatsMap);

        // Fetch product names
        const enrichedStats = await Promise.all(productStats.map(async (stat: any) => {
            const product = await prisma.product.findUnique({
                where: { id: stat.productId },
                select: { name: true }
            });
            return {
                ...stat,
                name: product?.name || "Unknown Product"
            };
        }));

        // Sort by views descending
        enrichedStats.sort((a, b) => b.views - a.views);

        return NextResponse.json(enrichedStats);
    } catch (error) {
        console.error("Failed to fetch product analytics:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
