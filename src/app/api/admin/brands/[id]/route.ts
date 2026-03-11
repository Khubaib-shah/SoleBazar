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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;
        await prisma.brand.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin: Failed to delete brand:", error);
        return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
        const { id } = await params;
        const { name, icon } = await request.json();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const brand = await prisma.brand.update({
            where: { id },
            data: { name, slug, icon },
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error("Admin: Failed to update brand:", error);
        return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
    }
}
