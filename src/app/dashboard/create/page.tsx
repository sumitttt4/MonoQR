"use client";

import { QRGenerator } from "@/components/qr-generator";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateQRPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const handleSave = async (data: any) => {
        if (!user) return;
        setSaving(true);
        const { error } = await supabase.from('qr_codes').insert({
            user_id: user.id,
            title: data.title,
            type: data.type,
            content: data.content,
            meta: data.meta
        });

        if (error) {
            console.error(error);
            alert("Failed to save QR code");
            setSaving(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create New QR Code</h1>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <QRGenerator onSave={handleSave} isSaving={saving} />
                </div>
            </div>
        </div>
    );
}
