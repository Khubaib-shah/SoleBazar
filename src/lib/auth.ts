import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                console.log("Login attempt for:", credentials.email);

                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email },
                });

                if (!admin) {
                    console.log("Admin not found in database");
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    admin.password
                );

                if (!isValid) {
                    console.log("Password mismatch");
                    return null;
                }

                console.log("Login successful for:", credentials.email);
                return {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
