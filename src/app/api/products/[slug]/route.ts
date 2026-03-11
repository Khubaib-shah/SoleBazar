import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/products/[slug] - Get single product by slug
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                brand: true,
                category: true,
                images: { orderBy: { order: "asc" } },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Fetch related products (same brand, different product)
        const related = await prisma.product.findMany({
            where: {
                brandId: product.brandId,
                id: { not: product.id },
            },
            include: {
                brand: true,
                category: true,
                images: { orderBy: { order: "asc" }, take: 1 },
            },
            take: 4,
        });

        return NextResponse.json({ product, related });
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}
