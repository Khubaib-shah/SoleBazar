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

// GET all categories (admin)
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
}

// POST create category
export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { name, icon } = await request.json();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const category = await prisma.category.create({
            data: { name, slug, icon },
        });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Failed to create category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
