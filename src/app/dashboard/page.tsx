"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, QrCode, Trash2, ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QRCode {
    id: string;
    title: string;
    type: string;
    scan_count: number;
    created_at: string;
    content: string;
}

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [qrs, setQrs] = useState<QRCode[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        } else if (user) {
            fetchQRs();
        }
    }, [user, isLoading, router]);

    const fetchQRs = async () => {
        setFetching(true);
        const { data, error } = await supabase
            .from('qr_codes')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setQrs(data);
        setFetching(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this QR code?")) return;
        const { error } = await supabase.from('qr_codes').delete().eq('id', id);
        if (!error) {
            setQrs(qrs.filter(q => q.id !== id));
        }
    };

    if (isLoading || (fetching && !qrs.length)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (!user) return null; // Will redirect

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My QR Codes</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Manage and track your generated codes</p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button className="shadow-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Create New
                        </Button>
                    </Link>
                </div>

                {/* Grid */}
                {qrs.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                            <QrCode className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No QR codes yet</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                            Create your first dynamic QR code to start tracking scans and managing content.
                        </p>
                        <Link href="/dashboard/create">
                            <Button variant="outline" className="mt-4">
                                Start Creating
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {qrs.map((qr) => (
                            <div key={qr.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <QrCode className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{qr.title}</h3>
                                            <p className="text-xs text-zinc-500 capitalize">{qr.type}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(qr.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1.5 text-zinc-500">
                                            <BarChart3 className="w-4 h-4" />
                                            <span>{qr.scan_count} scans</span>
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            {new Date(qr.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                                            <ExternalLink className="w-3 h-3 mr-2" />
                                            Preview
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
