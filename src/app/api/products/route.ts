import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/products - List all products
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get("brand");
        const category = searchParams.get("category");
        const condition = searchParams.get("condition");
        const size = searchParams.get("size");
        const gender = searchParams.get("gender");
        const featured = searchParams.get("featured");
        const search = searchParams.get("search");

        const where: Record<string, unknown> = {};

        if (brand && brand !== "All") {
            where.brand = { slug: brand };
        }
        if (category && category !== "All") {
            where.category = { slug: category };
        }
        if (gender && gender !== "All") {
            where.gender = gender;
        }
        if (condition && condition !== "All") {
            where.condition = condition;
        }
        if (size && size !== "All") {
            where.sizes = { contains: size };
        }
        if (featured === "true") {
            where.featured = true;
        }
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                brand: true,
                category: true,
                images: { orderBy: { order: "asc" } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
