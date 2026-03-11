import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
