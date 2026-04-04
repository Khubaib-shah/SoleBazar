import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                brand: true,
                                images: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Failed to fetch order details:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { status, customerName, phone, address, isDeleted } = body;

        const dataToUpdate: any = {
            ...(status && { status }),
            ...(customerName && { customerName }),
            ...(phone && { phone }),
            ...(address && { address }),
        };

        if (isDeleted !== undefined) {
             dataToUpdate.isDeleted = isDeleted;
             dataToUpdate.deletedAt = isDeleted ? new Date() : null;
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Failed to update order status:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
