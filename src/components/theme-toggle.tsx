"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            setIsDark(true);
        }
    };

    if (!mounted) return <div className="w-14 h-8" />; // Prevent hydration mismatch

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative w-16 h-8 rounded-full p-1 transition-all duration-300 ease-in-out",
                "border border-zinc-200 dark:border-zinc-800",
                "bg-zinc-100 dark:bg-zinc-900",
                "shadow-inner dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700"
            )}
            aria-label="Toggle premium theme"
        >
            <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
                <Sun className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
                <Moon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
            </div>

            <div
                className={cn(
                    "absolute top-1 bottom-1 w-6 rounded-full shadow-sm transition-all duration-300 ease-out flex items-center justify-center",
                    isDark
                        ? "translate-x-8 bg-zinc-800 border border-zinc-700 text-white"
                        : "translate-x-0 bg-white border border-zinc-200 text-zinc-900"
                )}
            >
                {isDark ? (
                    <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900/20" />
                )}
            </div>
        </button>
    );
}
