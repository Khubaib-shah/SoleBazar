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
        const [
            totalVisits,
            totalProductViews,
            totalProductClicks,
            checkoutVisits,
            purchases,
            orders
        ] = await Promise.all([
            prisma.analyticsEvent.count({ where: { eventType: "page_view" } }),
            prisma.analyticsEvent.count({ where: { eventType: "product_view" } }),
            prisma.analyticsEvent.count({ where: { eventType: "product_click" } }),
            prisma.analyticsEvent.count({ where: { eventType: "checkout_visit" } }),
            prisma.analyticsEvent.count({ where: { eventType: "purchase" } }),
            prisma.order.findMany({ select: { total: true } })
        ]);

        const conversionRate = totalVisits > 0 ? (purchases / totalVisits) * 100 : 0;
        const avgOrderValue = orders.length > 0 
            ? orders.reduce((acc, o) => acc + o.total, 0) / orders.length 
            : 0;

        return NextResponse.json({
            totalVisits,
            totalProductViews,
            totalProductClicks,
            checkoutVisits,
            conversionRate: conversionRate.toFixed(2) + "%",
            avgOrderValue: "PKR " + avgOrderValue.toLocaleString()
        });
    } catch (error) {
        console.error("Failed to fetch analytics summary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
