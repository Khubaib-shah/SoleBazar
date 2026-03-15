import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        
        const trafficData = await Promise.all(last7Days.map(async (date) => {
            const start = startOfDay(date);
            const end = endOfDay(date);

            const [visits, productViews] = await Promise.all([
                prisma.analyticsEvent.count({
                    where: {
                        eventType: "page_view",
                        timestamp: { gte: start, lte: end }
                    }
                }),
                prisma.analyticsEvent.count({
                    where: {
                        eventType: "product_view",
                        timestamp: { gte: start, lte: end }
                    }
                })
            ]);

            return {
                date: format(date, "MMM dd"),
                visits,
                productViews
            };
        }));

        return NextResponse.json(trafficData);
    } catch (error) {
        console.error("Failed to fetch traffic analytics:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
