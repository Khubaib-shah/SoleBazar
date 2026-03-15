import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerName,
            phone,
            email,
            address,
            items
        } = body;

        if (!customerName || !phone || !items || items.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Calculate total
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.productId}` },
                    { status: 404 }
                );
            }

            total += product.price * (item.quantity || 1);
            orderItems.push({
                productId: product.id,
                quantity: item.quantity || 1,
                size: item.size,
                color: item.color,
                price: product.price
            });
        }

        // Create order in DB
        const order = await prisma.order.create({
            data: {
                customerName,
                phone,
                email,
                address,
                total,
                status: "pending",
                items: {
                    create: orderItems
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                brand: true
                            }
                        }
                    }
                }
            }
        });

        // Send email notification to admin
        try {
            const settings = await prisma.setting.findFirst();
            if (settings?.smtpHost) {
                const notificationEmail = settings.notificationEmail || settings.email || "admin@solebazar.com";
                
                await sendEmail({
                    to: notificationEmail,
                    subject: `New Order Received - #${order.id.slice(-6).toUpperCase()}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                            <h2 style="color: #7C8C5C; border-bottom: 2px solid #7C8C5C; padding-bottom: 10px;">New Order Placed!</h2>
                            <p><strong>Order ID:</strong> #${order.id.slice(-6).toUpperCase()}</p>
                            <p><strong>Customer:</strong> ${order.customerName}</p>
                            <p><strong>Phone:</strong> ${order.phone}</p>
                            <p><strong>Total:</strong> Rs. ${order.total.toLocaleString()}</p>
                            <p><strong>Address:</strong> ${order.address}</p>
                            
                            <h3 style="margin-top: 20px;">Order Items:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #f9f9f9;">
                                        <th style="padding: 10px; text-align: left; border: 1px solid #eee;">Product</th>
                                        <th style="padding: 10px; text-align: center; border: 1px solid #eee;">Qty</th>
                                        <th style="padding: 10px; text-align: right; border: 1px solid #eee;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td style="padding: 10px; border: 1px solid #eee;">
                                                ${item.product.name} ${item.size ? `(Size: ${item.size})` : ""}
                                            </td>
                                            <td style="padding: 10px; text-align: center; border: 1px solid #eee;">${item.quantity}</td>
                                            <td style="padding: 10px; text-align: right; border: 1px solid #eee;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            
                            <div style="margin-top: 30px; padding: 15px; background: #FAFAF7; border-radius: 8px; text-align: center;">
                                <a href="${process.env.NEXTAUTH_URL}/admin/orders/${order.id}" style="background: #7C8C5C; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">View Full Order in Managed Admin</a>
                            </div>
                        </div>
                    `
                });
            }
        } catch (mailError) {
            console.error("Failed to send order notification email:", mailError);
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Public GET for orders might not be needed, but for debug/admin
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
