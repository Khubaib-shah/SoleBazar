import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        let settings = await prisma.setting.findFirst();

        if (!settings) {
            settings = await prisma.setting.create({
                data: {
                    siteName: "SOLEBAZAR",
                    email: "khubaibsyed820@gmail.com",
                    phone: "+92 316 2126865",
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json({
            error: "Failed to fetch settings",
            message: error.message
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        // Remove immutable/automatic fields
        const { id, createdAt, updatedAt, ...updateData } = data;

        // Ensure numeric fields are correctly typed
        if (updateData.smtpPort !== undefined && updateData.smtpPort !== null) {
            updateData.smtpPort = parseInt(updateData.smtpPort, 10);
        }

        const settings = await prisma.setting.findFirst();

        let updatedSettings;
        if (settings) {
            updatedSettings = await prisma.setting.update({
                where: { id: settings.id },
                data: updateData
            });
        } else {
            updatedSettings = await prisma.setting.create({
                data: updateData
            });
        }

        return NextResponse.json(updatedSettings);
    } catch (error: any) {
        console.error("Failed to update settings:", error);
        return NextResponse.json({
            error: "Failed to update settings",
            message: error.message
        }, { status: 500 });
    }
}
