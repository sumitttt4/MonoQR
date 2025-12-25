
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const router = useRouter();

    const handleEmailLogin = async () => {
        if (!email) return;
        setIsLoading(true);

        // Mock login - simulate sending magic link
        setTimeout(() => {
            setEmailSent(true);
            setIsLoading(false);
        }, 1500);
    };

    const handleMockLogin = () => {
        // Mock login - redirect to dashboard
        setIsLoading(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black relative">
            {/* Background Pattern - Light Mode */}
            <div
                className="fixed inset-0 z-0 pointer-events-none dark:hidden"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
                        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Background Pattern - Dark Mode */}
            <div
                className="fixed inset-0 z-0 hidden dark:block"
                style={{
                    backgroundColor: "#0c0c0c",
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)",
                }}
            />

            {/* Header with Logo */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-lg group-hover:shadow-xl transition-shadow">
                        <QrCode className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">MonoQR</span>
                </Link>
            </header>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    {/* Welcome Text */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Welcome back</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Sign in to access your saved QR codes</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl shadow-zinc-900/5 dark:shadow-black/20 space-y-4">

                        {/* Google Sign In */}
                        <Button
                            variant="outline"
                            onClick={handleMockLogin}
                            disabled={isLoading}
                            className="w-full h-11 relative border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                        >
                            <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="font-medium">Continue with Google</span>
                        </Button>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400 dark:text-zinc-500">Or continue with email</span>
                            </div>
                        </div>

                        {emailSent ? (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-3">
                                    <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Check your email!</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">We sent a magic link to {email}</p>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEmailSent(false)}
                                        className="flex-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                                    >
                                        Try different email
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleMockLogin}
                                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue →"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        className="h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleEmailLogin()}
                                    />
                                </div>
                                <Button
                                    className="w-full h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium rounded-xl"
                                    onClick={handleEmailLogin}
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Magic Link"}
                                </Button>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
                        By clicking continue, you agree to our{" "}
                        <Link href="#" className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300">Terms</Link>
                        {" "}and{" "}
                        <Link href="#" className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
