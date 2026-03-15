import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
