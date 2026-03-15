import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !message) {
            return NextResponse.json(
                { error: "Name and message are required" },
                { status: 400 }
            );
        }

        // Save to database
        const savedMessage = await prisma.message.create({
            data: {
                name,
                email,
                subject,
                message,
                status: "unread"
            }
        });

        // Fetch settings for notification email
        const settings = await prisma.setting.findFirst();
        const notificationEmail = settings?.notificationEmail || settings?.email || "admin@solebazar.com";

        // Send email notification
        if (settings?.smtpHost) {
            await sendEmail({
                to: notificationEmail,
                subject: `New Contact Message: ${subject || "No Subject"}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #7C8C5C;">New Message from ${name}</h2>
                        <p><strong>From:</strong> ${email || "Not provided"}</p>
                        <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="white-space: pre-wrap;">${message}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">This message was received via the SoleBazar contact form and saved to your dashboard.</p>
                    </div>
                `
            });
        }

        return NextResponse.json(savedMessage);
    } catch (error) {
        console.error("Contact message error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
