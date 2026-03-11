import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Middleware helper
async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

// GET /api/admin/products - List all products (admin)
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const products = await prisma.product.findMany({
            include: {
                brand: true,
                category: true,
                images: { orderBy: { order: "asc" } },
                _count: { select: { orderItems: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Admin: Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST /api/admin/products - Create a product
export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const body = await request.json();
        const {
            name,
            description,
            price,
            compareAt,
            condition,
            sizes,
            colors,
            stock,
            featured,
            brandId,
            categoryId,
            images,
        } = body;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                compareAt: compareAt ? parseFloat(compareAt) : null,
                condition: condition || "New",
                sizes: JSON.stringify(sizes || []),
                colors: colors ? JSON.stringify(colors) : null,
                stock: parseInt(stock) || 1,
                featured: featured || false,
                brandId,
                categoryId,
                images: images
                    ? {
                        create: images.map((img: { url: string; alt?: string }, i: number) => ({
                            url: img.url,
                            alt: img.alt || name,
                            order: i,
                        })),
                    }
                    : undefined,
            },
            include: { brand: true, category: true, images: true },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Admin: Failed to create product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
