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

// GET all brands (admin)
export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    const brands = await prisma.brand.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(brands);
}

// POST create brand
export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { name, icon } = await request.json();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const brand = await prisma.brand.create({
            data: { name, slug, icon },
        });
        return NextResponse.json(brand, { status: 201 });
    } catch (error) {
        console.error("Failed to create brand:", error);
        return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
    }
}
