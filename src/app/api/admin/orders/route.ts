import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const isDeletedStr = searchParams.get("isDeleted");
        const isDeleted = isDeletedStr === "true";

        const skip = (page - 1) * limit;

        const whereClause: any = {};

        if (isDeleted) {
            whereClause.isDeleted = true;
        } else {
            whereClause.OR = [
                { isDeleted: false },
                { isDeleted: null },
                { isDeleted: { isSet: false } }
            ];
        }

        if (status !== "all" && status !== "") {
            whereClause.status = status;
        }

        if (search) {
            whereClause.OR = [
                { customerName: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } }
            ];
            // If search is a valid ObjectId, we could also search by ID
            if (search.length === 24) {
                whereClause.OR.push({ id: search });
            }
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: whereClause,
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
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.order.count({ where: whereClause })
        ]);

        return NextResponse.json({
            orders,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error: any) {
        console.error("Failed to fetch admin orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders", details: error.message }, { status: 500 });
    }
}
