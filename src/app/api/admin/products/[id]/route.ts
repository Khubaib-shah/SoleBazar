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

// GET /api/admin/products/[id]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { brand: true, category: true, images: { orderBy: { order: "asc" } } },
    });

    if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
}

// PUT /api/admin/products/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;
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
            isTopPick,
            gender,
        } = body;

        if (!name || !brandId || !categoryId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Delete old images and create new ones
        if (images && Array.isArray(images)) {
            await prisma.productImage.deleteMany({ where: { productId: id } });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                price: Number(price) || 0,
                compareAt: compareAt ? Number(compareAt) : null,
                condition,
                sizes: sizes && typeof sizes === 'string' ? sizes : JSON.stringify(sizes || []),
                colors: colors && typeof colors === 'string' ? colors : (colors ? JSON.stringify(colors) : null),
                stock: parseInt(stock.toString()) || 0,
                featured: featured || false,
                isTopPick: isTopPick || false,
                gender: gender || "Unisex",
                brandId,
                categoryId,
                images: images && Array.isArray(images)
                    ? {
                        create: images.filter((img: any) => img.url).map((img: { url: string; alt?: string }, i: number) => ({
                            url: img.url,
                            alt: img.alt || name,
                            order: i,
                        })),
                    }
                    : undefined,
            },
            include: { brand: true, category: true, images: true },
        });

        return NextResponse.json(product);
    } catch (error: any) {
        console.error("Admin: Failed to update product:", error);

        // Handle unique constraint (slug)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Product with this name already exists (Slug conflict)" }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to update product: " + (error.message || "Unknown error") }, { status: 500 });
    }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin: Failed to delete product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
