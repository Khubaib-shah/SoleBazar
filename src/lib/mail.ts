import nodemailer from "nodemailer";
import { prisma } from "./prisma";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const settings = await prisma.setting.findFirst();

    if (!settings || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
      console.warn("SMTP settings not configured. Email not sent.");
      return { success: false, error: "SMTP not configured" };
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort || 587,
      secure: settings.smtpPort === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: settings.smtpFrom || `"SoleBazar" <${settings.smtpUser}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
