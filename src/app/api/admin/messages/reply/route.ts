import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { to, subject, message } = body;

        if (!to || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const emailResult = await sendEmail({
            to,
            subject: `Re: ${subject}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #2B2B2B;">
                    <h2 style="color: #7C8C5C; border-bottom: 2px solid #F5EBDC; padding-bottom: 10px;">SoleBazar Support</h2>
                    <p style="font-size: 16px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E8DCC8; font-size: 12px; color: #999;">
                        <p>This is a reply to your inquiry on SoleBazar. If you have any further questions, please let us know.</p>
                        <p>&copy; ${new Date().getFullYear()} SoleBazar. All rights reserved.</p>
                    </div>
                </div>
            `
        });

        if (emailResult.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: emailResult.error || "Failed to send email" }, { status: 500 });
        }
    } catch (error) {
        console.error("Reply API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
