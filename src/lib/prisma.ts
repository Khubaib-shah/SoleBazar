import { PrismaClient } from "../generated/client";
import { config } from "dotenv";
import path from "path";

// Explicitly load .env - Next.js handles this usually, but for custom Prisma Clients it's safer
config({ path: path.resolve(process.cwd(), ".env") });

const url = process.env.MONGODB_URL?.trim();

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Use explicit runtime connection string to avoid validation issues on some environments
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        db: {
            url: url
        }
    }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
