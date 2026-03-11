import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isTopPick: true },
            include: {
                brand: true,
                category: true,
                images: { orderBy: { order: "asc" } },
            },
            take: 8,
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch top picks:", error);
        return NextResponse.json({ error: "Failed to fetch top picks" }, { status: 500 });
    }
}
