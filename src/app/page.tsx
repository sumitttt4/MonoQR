"use client";

import { useState } from "react";
import Link from "next/link";
import { QRGenerator } from "@/components/qr-generator";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { SpeedShape, PrivacyShape, ExportShape, ResponsiveShape } from "@/components/3d-icons";
import {
    Check,
    Zap,
    Crown,
    Share2,
    Shield,
    Smartphone,
    ArrowRight,
    Github,
    Twitter,
    Linkedin,
    Activity,
    Layers,
    Palette,
    Lock,
    QrCode
} from "lucide-react";

export default function LandingPage() {

    const [isDemoOpen, setIsDemoOpen] = useState(false);
    const [isAnnual, setIsAnnual] = useState(true);

    const scrollToGenerator = () => {
        const element = document.getElementById('qr-generator');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-zinc-50 selection:bg-zinc-900 dark:selection:bg-white selection:text-white dark:selection:text-zinc-900 font-sans relative">
            {/* Global Light Mode - Diagonal Grid Background */}
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

            {/* Global Dark Mode - Striped Background */}
            <div
                className="fixed inset-0 z-0 hidden dark:block"
                style={{
                    backgroundColor: "#0c0c0c",
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px)",
                }}
            />
            {/* Video Modal */}
            {isDemoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDemoOpen(false)}>
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
                            onClick={() => setIsDemoOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        <div className="w-full h-full flex items-center justify-center text-white/50 bg-zinc-900">
                            {/* Placeholder for Video */}
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                                <p>Video Demo Placeholder</p>
                            </div>
                            {/* <iframe src="YOUR_VIDEO_URL" className="w-full h-full" ... /> */}
                        </div>
                    </div>
                </div>
            )}

            {/* Fixed "Made by Sumit" Badge */}
            <a
                href="https://sumitsharmaa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Made by Sumit
            </a>

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-24 overflow-hidden relative z-10">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-8 leading-[1.05]">
                            Instant QR Codes <br />
                            for Modern Brands.
                        </h1>

                        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12">
                            Create vector-quality, custom-branded QR codes instantly in your browser.<br />
                            No sign-up required for basics. Enterprise-grade privacy included.
                        </p>

                        <Button
                            onClick={scrollToGenerator}
                            size="lg"
                            shape="pill"
                            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white shadow-xl px-10 h-12 text-base font-medium"
                        >
                            Create QR
                        </Button>
                    </div>

                    {/* App Preview / Generator */}
                    <div id="qr-generator" className="relative mx-auto max-w-6xl">
                        {/* Outer Shadow / Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-zinc-200/50 to-transparent dark:from-zinc-800/30 dark:to-transparent rounded-[2rem] blur-2xl" />

                        <div
                            className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                            style={{
                                boxShadow: `
                                    0 25px 50px -12px rgba(0, 0, 0, 0.15),
                                    0 0 0 1px rgba(0, 0, 0, 0.02),
                                    inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                                    inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)
                                `
                            }}
                        >
                            <div className="min-h-[600px] h-auto">
                                <QRGenerator />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Bento Grid Features */}
            <section id="features" className="py-32 bg-white dark:bg-zinc-950">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes in-left {
                        0% { transform: translateX(-60px) scale(0.8); opacity: 0; }
                        50% { transform: translateX(-30px) scale(1); opacity: 1; }
                        100% { transform: translateX(0) scale(0); opacity: 0; }
                    }
                    @keyframes in-top {
                        0% { transform: translateY(-60px) scale(0.8); opacity: 0; }
                        50% { transform: translateY(-30px) scale(1); opacity: 1; }
                        100% { transform: translateY(0) scale(0); opacity: 0; }
                    }
                    @keyframes in-bottom {
                        0% { transform: translateY(60px) scale(0.8); opacity: 0; }
                        50% { transform: translateY(30px) scale(1); opacity: 1; }
                        100% { transform: translateY(0) scale(0); opacity: 0; }
                    }
                    @keyframes pulse-glow {
                        0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(37,99,235,0.4); }
                        50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(37,99,235,0.6); }
                    }
                    @keyframes marquee-x {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    @keyframes marquee-y {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(100%); }
                    }
                    .animate-in-left { animation: in-left 3s ease-in-out infinite; }
                    .animate-in-top { animation: in-top 3s ease-in-out infinite; animation-delay: 1s; }
                    .animate-in-bottom { animation: in-bottom 3s ease-in-out infinite; animation-delay: 2s; }
                    .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
                    .animate-marquee-x { animation: marquee-x 8s linear infinite; }
                    .animate-marquee-y { animation: marquee-y 8s linear infinite; }
                    .transform-style-3d { transform-style: preserve-3d; }
                `}} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-3">Capabilities</h2>
                        <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 font-display">
                            Everything you need.
                        </p>
                    </div>

                    {/* Grid Layout: 2x2 for Balance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Feature 1: Universal Input (Wide) - Blue/Indigo Theme */}
                        <div className="col-span-1 md:col-span-2 bg-blue-50/50 dark:bg-[#0A0A0B] rounded-[2.5rem] p-12 border border-blue-100 dark:border-white/5 shadow-xl dark:shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between group transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-transparent opacity-100 dark:opacity-50" />
                            <div className="relative z-10 max-w-lg">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></div>
                                    Live Generation
                                </div>
                                <h3 className="text-4xl font-bold text-blue-900 dark:text-white mb-4 tracking-tight">Any Input. Instant QR.</h3>
                                <p className="text-blue-700/80 dark:text-zinc-400 text-lg leading-relaxed">
                                    Paste a URL, drop a location pin, or type a message.
                                    Our engine transforms your raw data into a scan-ready masterpiece in milliseconds.
                                </p>
                            </div>
                            <div className="w-full md:w-[400px] h-[300px] relative mt-10 md:mt-0 flex items-center justify-center">
                                <SpeedShape />
                            </div>
                        </div>

                        {/* Feature 2: Production Vectors - Amber/Orange Theme */}
                        <div className="col-span-1 bg-amber-50/50 dark:bg-[#0A0A0B] rounded-[2.5rem] p-10 border border-amber-100 dark:border-white/5 shadow-xl dark:shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[400px] group hover:border-amber-200 dark:hover:border-white/10 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-100/50 via-transparent to-transparent dark:from-[#0A0A0B] dark:via-transparent dark:to-transparent z-10" />
                            <div className="absolute inset-0 flex items-center justify-center -translate-y-12">
                                <ExportShape />
                            </div>
                            <div className="relative z-20">
                                <h3 className="text-2xl font-bold text-amber-900 dark:text-white mb-3">Production Vectors</h3>
                                <p className="text-amber-800/80 dark:text-zinc-400 leading-relaxed">
                                    Crisp SVG, PDF, and PNG exports. Ready for billboards or business cards.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3: Sovereign Privacy - Emerald/Green Theme */}
                        <div className="col-span-1 bg-emerald-50/50 dark:bg-[#0A0A0B] rounded-[2.5rem] p-10 border border-emerald-100 dark:border-white/5 shadow-xl dark:shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[400px] group hover:border-emerald-200 dark:hover:border-white/10 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/50 via-transparent to-transparent dark:from-[#0A0A0B] dark:via-transparent dark:to-transparent z-10" />
                            <div className="absolute inset-0 flex items-center justify-center -translate-y-12">
                                <PrivacyShape />
                            </div>
                            <div className="relative z-20">
                                <h3 className="text-2xl font-bold text-emerald-900 dark:text-white mb-3">Sovereign Privacy</h3>
                                <p className="text-emerald-800/80 dark:text-zinc-400 leading-relaxed">
                                    Logic runs 100% in your browser. Zero tracking. Zero data leaks.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4: Fluid Design (Wide) - Rose/Purple Theme */}
                        <div className="col-span-1 md:col-span-2 bg-rose-50/50 dark:bg-[#0A0A0B] rounded-[2.5rem] p-12 border border-rose-100 dark:border-white/5 shadow-xl dark:shadow-2xl relative overflow-hidden flex flex-col md:flex-row-reverse items-center justify-between group transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-bl from-rose-100/50 to-purple-50/50 dark:from-emerald-500/5 dark:to-transparent opacity-100 dark:opacity-50" />
                            <div className="relative z-10 max-w-lg">
                                <h3 className="text-3xl font-bold text-rose-900 dark:text-white mb-4 tracking-tight">Fluid Design System</h3>
                                <p className="text-rose-700/80 dark:text-zinc-400 text-lg leading-relaxed">
                                    Adaptive layouts that look stunning on any device. From mobile screens to 4K monitors.
                                </p>
                            </div>
                            <div className="w-full md:w-[400px] h-[300px] relative mt-10 md:mt-0 flex items-center justify-center">
                                <ResponsiveShape />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl mb-4">Simple, transparent pricing</h2>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">
                            Start for free, upgrade for branding and analytics.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-zinc-500 transition-colors">
                            <div className="mb-4">
                                <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Basic</span>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">$0</span>
                                    <span className="text-zinc-500 dark:text-zinc-400">/forever</span>
                                </div>
                                <p className="mt-4 text-zinc-500 dark:text-zinc-400">Perfect for individuals and side projects.</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['Unlimited Static QRs', 'PNG Download', 'Basic Customization', 'No Credit Card Req.'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Button variant="outline" className="w-full h-12 rounded-full border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Start for Free</Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="rounded-3xl p-8 border-2 border-white/20 dark:border-white/30 bg-zinc-900 dark:bg-zinc-900 text-white relative overflow-hidden ring-4 ring-white/10 dark:ring-white/20">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 bg-white px-3 py-1 rounded-full shadow-lg">Popular</div>
                            </div>
                            <div className="mb-4">
                                <span className="text-lg font-medium text-zinc-200">Pro</span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-xl text-zinc-500 line-through">$9</span>
                                    <span className="text-4xl font-bold text-white">$5</span>
                                    <span className="text-zinc-400">one-time</span>
                                </div>
                                <p className="mt-4 text-zinc-400">For brands needing custom design & vectors.</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {['Everything in Basic', 'SVG / EPS Vector Export', 'Remove Watermark', 'Custom Logos & Colors', 'Priority Support'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <Check className="w-4 h-4 text-blue-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a href="https://checkout.dodopayments.com/buy/pdt_0NUpr71K4ovrJrT6EJha8?quantity=1" className="block">
                                <Button variant="shiny" className="w-full h-12">Get Started</Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Logo & About */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900">
                                    <QrCode className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-lg text-zinc-900 dark:text-white">MonoQR</span>
                            </Link>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center md:text-left max-w-xs">
                                Create beautiful, custom QR codes instantly. No sign-up required.
                            </p>
                        </div>

                        {/* Social & Copyright */}
                        <div className="flex flex-col items-center md:items-end gap-4">
                            <a
                                href="https://x.com/Sumitthq"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                            >
                                {/* X Logo */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="text-sm font-medium">Follow on X</span>
                            </a>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500">
                                &copy; {new Date().getFullYear()} MonoQR. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
