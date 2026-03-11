import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Force load project .env to override system-level environment variables
config({ override: true });

const url = process.env.DATABASE_URL;

if (url && !url.startsWith("mongodb")) {
    console.warn("⚠️ WARNING: DATABASE_URL does not start with 'mongodb'. Current value:", url);
    console.warn("This usually happens when a system-level environment variable overrides the project .env.");
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
