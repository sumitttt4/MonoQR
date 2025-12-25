import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { data } = supabase.storage
        .from('Photo Upload')
        .getPublicUrl(params.id);

    return {
        title: "Image | MonoQR",
        description: "View this image shared via MonoQR",
        openGraph: {
            title: "Image shared via MonoQR",
            description: "View this image shared via MonoQR",
            images: data?.publicUrl ? [data.publicUrl] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: "Image shared via MonoQR",
            images: data?.publicUrl ? [data.publicUrl] : [],
        },
    };
}

export default function ImageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
