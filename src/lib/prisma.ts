import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import path from "path";

// Explicitly load .env from the root directory to be sure
config({
    path: path.resolve(process.cwd(), ".env"),
    override: true
});

const url = process.env.DATABASE_URL;

if (url && !url.startsWith("mongodb")) {
    console.warn("⚠️ CRITICAL WARNING: DATABASE_URL is NOT MongoDB.");
    console.warn("Detected Protocol:", url.split(":")[0]);
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// In Prisma 5.x/6.x, we can use the datasources option for runtime connection string override
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        db: {
            url: url
        }
    }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
