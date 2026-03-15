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
        // 1. Get Sales by Category
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                },
                products: {
                    select: {
                        orderItems: {
                            select: {
                                price: true,
                                quantity: true
                            }
                        }
                    }
                }
            }
        });

        const categorySales = categories.map(cat => ({
            name: cat.name,
            value: cat.products.reduce((acc, prod) => 
                acc + prod.orderItems.reduce((pAcc, item) => pAcc + (item.price * item.quantity), 0), 0)
        })).filter(cat => cat.value > 0);

        // 2. Get Sales by Brand
        const brands = await prisma.brand.findMany({
            include: {
                _count: {
                    select: { products: true }
                },
                products: {
                    select: {
                        orderItems: {
                            select: {
                                price: true,
                                quantity: true
                            }
                        }
                    }
                }
            }
        });

        const brandSales = brands.map(brand => {
            const totalRevenue = brand.products.reduce((acc, prod) => 
                acc + prod.orderItems.reduce((pAcc, item) => pAcc + (item.price * item.quantity), 0), 0);
            const totalOrders = brand.products.reduce((acc, prod) => acc + prod.orderItems.length, 0);
            
            return {
                name: brand.name,
                revenue: totalRevenue,
                sales: totalOrders,
                // Simple market share calculation logic (revenue basis)
            };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        const totalRevenueAcrossBrands = brandSales.reduce((acc, b) => acc + b.revenue, 0);
        const brandSalesWithShare = brandSales.map(brand => ({
            ...brand,
            share: totalRevenueAcrossBrands > 0 ? Math.round((brand.revenue / totalRevenueAcrossBrands) * 100) : 0,
            revenueFormatted: `PKR ${brand.revenue.toLocaleString()}`
        }));

        // 3. Monthly Revenue (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: sixMonthsAgo },
                status: { not: "cancelled" }
            },
            select: {
                total: true,
                createdAt: true
            }
        });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRevenueMap: Record<string, number> = {};

        // Pre-fill last 6 months
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            monthlyRevenueMap[monthNames[d.getMonth()]] = 0;
        }

        orders.forEach(order => {
            const month = monthNames[new Date(order.createdAt).getMonth()];
            if (monthlyRevenueMap[month] !== undefined) {
                monthlyRevenueMap[month] += order.total;
            }
        });

        const revenueGrowth = Object.entries(monthlyRevenueMap)
            .map(([name, revenue]) => ({ name, revenue }))
            .reverse();

        // 4. Mock Traffic Data (since we don't track it yet)
        const trafficData = [
            { name: 'Mon', visits: 420, clicks: 250 },
            { name: 'Tue', visits: 380, clicks: 190 },
            { name: 'Wed', visits: 510, clicks: 310 },
            { name: 'Thu', visits: 450, clicks: 280 },
            { name: 'Fri', visits: 620, clicks: 390 },
            { name: 'Sat', visits: 780, clicks: 520 },
            { name: 'Sun', visits: 850, clicks: 610 },
        ];

        // 5. Overall Summary Stats
        const totalVisits = "4.2k"; // Mock
        const conversionRate = "2.8%"; // Mock
        const totalClicks = "2.3k"; // Mock
        const avgOrderValue = orders.length > 0 
            ? Math.round(orders.reduce((acc, o) => acc + o.total, 0) / orders.length) 
            : 0;

        return NextResponse.json({
            categorySales: categorySales.length > 0 ? categorySales : [
                { name: "Sneakers", value: 400 },
                { name: "Formal", value: 300 },
                { name: "Loafers", value: 200 }
            ],
            brandSales: brandSalesWithShare.length > 0 ? brandSalesWithShare : [
                 { name: "Nike", sales: "142", revenueFormatted: "PKR 582,000", share: 85 },
                 { name: "Adidas", sales: "98", revenueFormatted: "PKR 342,000", share: 62 }
            ],
            revenueGrowth,
            trafficData,
            summary: {
                totalVisits,
                conversionRate,
                totalClicks,
                avgOrderValue: `PKR ${avgOrderValue.toLocaleString()}`
            }
        });

    } catch (error) {
        console.error("Failed to fetch reports:", error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}
