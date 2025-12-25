"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { QrCode, Download, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ImageViewerPage() {
    const params = useParams();
    const imageId = params.id as string;
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (imageId) {
            // Get public URL from Supabase Storage
            const { data } = supabase.storage
                .from('uploads')
                .getPublicUrl(imageId);

            if (data?.publicUrl) {
                setImageUrl(data.publicUrl);
                setIsLoading(false);
            } else {
                setError("Image not found");
                setIsLoading(false);
            }
        }
    }, [imageId]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Shared via MonoQR',
                    url: window.location.href
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = imageId;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black relative">
            {/* Background Pattern - Light Mode */}
            <div
                className="fixed inset-0 z-0 pointer-events-none dark:hidden"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px),
                        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 20px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Background Pattern - Dark Mode */}
            <div
                className="fixed inset-0 z-0 hidden dark:block"
                style={{
                    backgroundColor: "#0c0c0c",
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)",
                }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-lg group-hover:shadow-xl transition-shadow">
                            <QrCode className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg text-zinc-900 dark:text-white">MonoQR</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                            className="border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleDownload}
                            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-24 pb-12">
                <div className="w-full max-w-4xl">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 animate-pulse">
                                <QrCode className="w-8 h-8 text-zinc-400" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400">Loading image...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                                <QrCode className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Image Not Found</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-6">This image may have been removed or the link is incorrect.</p>
                            <Link href="/">
                                <Button variant="outline" className="border-zinc-200 dark:border-zinc-700">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-zinc-900/10 dark:shadow-black/30">
                            {/* Image Container */}
                            <div className="relative bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                                <img
                                    src={imageUrl!}
                                    alt="Shared via MonoQR"
                                    className="max-w-full max-h-[70vh] object-contain"
                                    onError={() => setError("Failed to load image")}
                                />
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center">
                                        <QrCode className="w-3 h-3 text-white dark:text-zinc-900" />
                                    </div>
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Shared via MonoQR</span>
                                </div>
                                <Link
                                    href="/"
                                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                >
                                    Create your own →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
