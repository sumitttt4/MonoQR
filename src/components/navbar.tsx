"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Menu, Github, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
];

export function Navbar() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Floating Pill Navbar */}
                <div className="flex items-center justify-between h-14 px-4 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg shadow-zinc-900/5">

                    {/* Left - Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
                            <QrCode className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                            MonoQR
                        </span>
                    </Link>

                    {/* Center - Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                resolvedTheme === "dark" ? (
                                    <Sun className="w-4 h-4" />
                                ) : (
                                    <Moon className="w-4 h-4" />
                                )
                            ) : (
                                <div className="w-4 h-4" />
                            )}
                        </button>

                        {/* Get Started Button - Desktop */}
                        <Link href="/login" className="hidden sm:block">
                            <Button size="sm" shape="pill" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white shadow-sm h-9 px-4">
                                Get Started
                            </Button>
                        </Link>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <button className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
                                <div className="flex flex-col h-full pt-8">
                                    {/* Mobile Nav Links */}
                                    <nav className="flex flex-col gap-1">
                                        {navLinks.map((link) => (
                                            <SheetClose asChild key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </nav>

                                    {/* Mobile Actions */}
                                    <div className="mt-auto pb-8 px-4 space-y-4">
                                        <a
                                            href="https://github.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                        >
                                            <Github className="w-4 h-4" />
                                            View on GitHub
                                        </a>
                                        <SheetClose asChild>
                                            <Link href="/login" className="block">
                                                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white rounded-xl">
                                                    Get Started
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
