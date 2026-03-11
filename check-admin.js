const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config({ override: true });

async function checkAdmin() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  try {
    console.log("Checking DB:", process.env.DATABASE_URL);
    const admin = await prisma.admin.findUnique({
      where: { email: "admin@solebazar.com" }
    });
    
    if (admin) {
      console.log("✅ Admin found in database!");
      console.log("Email:", admin.email);
      console.log("Stored Hash:", admin.password);
      
      const isMatch = await bcrypt.compare("admin123", admin.password);
      console.log("Password 'admin123' check:", isMatch ? "MATCH!" : "FAIL!");
    } else {
      console.log("❌ Admin NOT found in database.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
