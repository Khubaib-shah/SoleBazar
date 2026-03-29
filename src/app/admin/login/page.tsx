"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export default function AdminLoginPage() {
    const { settings } = useSettings();
    const siteName = settings?.siteName || "SoleBazar";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/admin/dashboard");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-[#E8DCC8]/50">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F5EBDC] rounded-full mb-6 text-[#7C8C5C]">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-[#2B2B2B] mb-2">Admin Portal</h1>
                    <p className="text-[#555] font-bold uppercase tracking-widest text-[10px]">Security Authorized Only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] transition-all font-bold placeholder:text-gray-300"
                            placeholder="admin@solebazar.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#555] ml-4">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-2 md:px-6 py-4 bg-[#FAFAF7] border-2 border-[#E8DCC8] rounded-3xl focus:outline-none focus:border-[#7C8C5C] transition-all font-bold placeholder:text-gray-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2B2B2B] hover:bg-[#7C8C5C] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Sign In to Dashboard"
                        )}
                    </button>
                </form>

                <p className="mt-10 text-center text-[#999] text-[10px] font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} {siteName} System v1.0
                </p>
            </div>
        </div>
    );
}
