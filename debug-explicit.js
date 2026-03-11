const { PrismaClient } = require("@prisma/client");

async function test() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "mongodb+srv://todo:todo@todo.p4vcr.mongodb.net/test"
      }
    }
  });
  try {
    console.log("Connecting with explicit URL...");
    const products = await prisma.product.findMany();
    console.log("Success! Found:", products.length);
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
