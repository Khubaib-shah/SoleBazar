import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const [productCount, orderCount, brandCount, categoryCount, recentOrders, revenue] =
            await Promise.all([
                prisma.product.count(),
                prisma.order.count(),
                prisma.brand.count(),
                prisma.category.count(),
                prisma.order.findMany({
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    include: { items: { include: { product: true } } },
                }),
                prisma.order.aggregate({ _sum: { total: true } }),
            ]);

        return NextResponse.json({
            productCount,
            orderCount,
            brandCount,
            categoryCount,
            recentOrders,
            totalRevenue: revenue._sum.total || 0,
        });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
