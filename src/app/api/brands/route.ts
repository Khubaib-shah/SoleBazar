import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/brands
export async function GET() {
    try {
        const brands = await prisma.brand.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { products: true } } },
        });
        return NextResponse.json(brands);
    } catch (error) {
        console.error("Failed to fetch brands:", error);
        return NextResponse.json(
            { error: "Failed to fetch brands" },
            { status: 500 }
        );
    }
}
