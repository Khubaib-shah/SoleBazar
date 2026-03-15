import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventType, userId, sessionId, productId, page, userAgent, referrer } = body;

        if (!eventType || !sessionId || !page) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const event = await prisma.analyticsEvent.create({
            data: {
                eventType,
                userId,
                sessionId,
                productId,
                page,
                userAgent,
                referrer,
            }
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error("Failed to track event:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
