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
        const [productCount, orderCount, brandCount, categoryCount, recentOrders, revenueResult] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.brand.count(),
            prisma.category.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
            }),
            prisma.order.aggregate({
                _sum: { total: true }
            })
        ]);

        const totalRevenue = revenueResult._sum.total || 0;

        return NextResponse.json({
            productCount,
            orderCount,
            brandCount,
            categoryCount,
            recentOrders,
            totalRevenue
        });
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
