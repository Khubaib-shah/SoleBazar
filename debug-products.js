const { PrismaClient } = require("@prisma/client");

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log("Connecting to MongoDB...");
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        images: { orderBy: { order: "asc" } },
      },
    });
    console.log("Found products:", products.length);
  } catch (err) {
    console.error("CRITICAL ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
