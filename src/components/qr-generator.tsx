"use client";

import * as React from "react";
import { useState, useRef, useEffect, useMemo, ChangeEvent } from "react";
import {
    Link as LinkIcon,
    Wifi,
    User,
    Mail,
    MessageSquare,
    Phone,
    Type,
    Download,
    RotateCcw,
    FileText,
    Image as ImageIcon,
    Settings,
    Palette,
    Upload,
    Lock,
    MapPin,
    Calendar,
    Bitcoin,
    Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

// Import types only, actual import happens in useEffect
import type QRCodeStyling from "qr-code-styling";
import type { Options, DotType, CornerSquareType, CornerDotType } from "qr-code-styling";

type TabType = "url" | "text" | "phone" | "sms" | "email" | "wifi" | "vcard" | "style" | "location" | "event" | "crypto" | "social" | "image";

const tabs = [
    { id: "url", label: "URL", icon: <LinkIcon className="w-4 h-4" /> },
    { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
    { id: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "wifi", label: "WiFi", icon: <Wifi className="w-4 h-4" /> },
    { id: "vcard", label: "Contact", icon: <User className="w-4 h-4" /> },
    { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
    { id: "sms", label: "SMS", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "phone", label: "Phone", icon: <Phone className="w-4 h-4" /> },
    { id: "social", label: "Social", icon: <Share2 className="w-4 h-4" /> },
    { id: "location", label: "Location", icon: <MapPin className="w-4 h-4" /> },
    { id: "event", label: "Event", icon: <Calendar className="w-4 h-4" /> },
    { id: "crypto", label: "Crypto", icon: <Bitcoin className="w-4 h-4" /> },
    { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
];

interface QRGeneratorProps {
    onSave?: (data: {
        title: string;
        type: string;
        content: string;
        meta: any;
    }) => Promise<void>;
    isSaving?: boolean;
}

export function QRGenerator({ onSave, isSaving }: QRGeneratorProps) {
    const [title, setTitle] = useState("My QR Code");
    const [activeTab, setActiveTab] = useState<TabType>("url");
    const [lastContentTab, setLastContentTab] = useState<TabType>("url");
    const [isPro, setIsPro] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Style State
    const [bgColor, setBgColor] = useState("#ffffff");
    const [fgColor, setFgColor] = useState("#000000");
    const [logoSrc, setLogoSrc] = useState<string | undefined>(undefined);
    const [dotsStyle, setDotsStyle] = useState<DotType>("square");
    const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>("square");
    const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>("square");

    // Gradient State
    const [useGradient, setUseGradient] = useState(false);
    const [gradientColor1, setGradientColor1] = useState("#000000");
    const [gradientColor2, setGradientColor2] = useState("#000000");
    const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
    const [gradientRotation, setGradientRotation] = useState(0);

    // Form States
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const [phone, setPhone] = useState("");
    const [smsPhone, setSmsPhone] = useState("");
    const [smsMsg, setSmsMsg] = useState("");
    const [emailTo, setEmailTo] = useState("");
    const [emailSub, setEmailSub] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [wifiSsid, setWifiSsid] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifiEncryption, setWifiEncryption] = useState("WPA");
    const [wifiHidden, setWifiHidden] = useState(false);
    const [vcardName, setVcardName] = useState("");
    const [vcardPhone, setVcardPhone] = useState("");
    const [vcardEmail, setVcardEmail] = useState("");
    const [vcardOrg, setVcardOrg] = useState("");

    // New States
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");

    const [eventTitle, setEventTitle] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventStart, setEventStart] = useState("");
    const [eventEnd, setEventEnd] = useState("");
    const [eventNote, setEventNote] = useState("");

    const [cryptoType, setCryptoType] = useState("bitcoin");
    const [cryptoAddr, setCryptoAddr] = useState("");
    const [cryptoAmount, setCryptoAmount] = useState("");

    const [socialPlatform, setSocialPlatform] = useState("twitter");
    const [socialUsername, setSocialUsername] = useState("");

    // Image Upload State
    const [imageUrl, setImageUrl] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const qrRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    // Dynamic QR Value Calculation
    const qrValue = useMemo(() => {
        const actualTab = activeTab === "style" ? lastContentTab : activeTab;

        switch (actualTab) {
            case "url": {
                if (!url) return "https://monoqr.com";
                let finalUrl = url.trim();
                if (!finalUrl.match(/^https?:\/\//)) {
                    finalUrl = `https://${finalUrl}`;
                }
                return finalUrl;
            }
            case "text": {
                return text || "Hello World";
            }
            case "phone": {
                return phone ? `tel:${phone}` : "tel:1234567890";
            }
            case "sms": {
                return `SMSTO:${smsPhone}:${smsMsg}`;
            }
            case "email": {
                return `MATMSG:TO:${emailTo};SUB:${emailSub};BODY:${emailBody};;`;
            }
            case "wifi": {
                const escape = (str: string) => str.replace(/([\\;,:])/g, '\\$1');
                const ssid = escape(wifiSsid);
                const pass = escape(wifiPassword);
                const hidden = wifiHidden ? 'true' : 'false';
                return `WIFI:T:${wifiEncryption};S:${ssid};P:${pass};H:${hidden};;`;
            }
            case "vcard": {
                return `BEGIN:VCARD
VERSION:3.0
N:${vcardName}
FN:${vcardName}
ORG:${vcardOrg}
TEL:${vcardPhone}
EMAIL:${vcardEmail}
END:VCARD`;
            }
            case "location": {
                return `geo:${lat},${long}`;
            }
            case "event": {
                // Basic VEVENT format
                const formatDate = (dateStr: string) => {
                    if (!dateStr) return "";
                    return dateStr.replace(/[-:]/g, "") + "00"; // Simple compact format YYYYMMDDTHHMMSS
                };
                return `BEGIN:VEVENT
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DTSTART:${formatDate(eventStart)}
DTEND:${formatDate(eventEnd)}
DESCRIPTION:${eventNote}
END:VEVENT`;
            }
            case "crypto": {
                if (cryptoType === 'bitcoin') {
                    return `bitcoin:${cryptoAddr}?amount=${cryptoAmount}`;
                } else if (cryptoType === 'ethereum') {
                    return `ethereum:${cryptoAddr}?amount=${cryptoAmount}`; // ETH varies but standard is often usually just hex or IBAN
                } else {
                    return cryptoAddr;
                }
            }
            case "social": {
                const cleanUser = socialUsername.trim();
                switch (socialPlatform) {
                    case "twitter": return `https://twitter.com/${cleanUser}`;
                    case "facebook": return `https://facebook.com/${cleanUser}`;
                    case "instagram": return `https://instagram.com/${cleanUser}`;
                    case "linkedin": return `https://linkedin.com/in/${cleanUser}`;
                    case "youtube": return `https://youtube.com/@${cleanUser}`;
                    case "github": return `https://github.com/${cleanUser}`;
                    default: return `https://twitter.com/${cleanUser}`;
                }
            }
            case "image": {
                // Return the uploaded image URL for QR code
                return imageUrl || "https://monoqr.com/demo-image";
            }
            default: return "https://monoqr.com";
        }
    }, [activeTab, lastContentTab, url, text, phone, smsPhone, smsMsg, emailTo, emailSub, emailBody, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, vcardName, vcardPhone, vcardEmail, vcardOrg, lat, long, eventTitle, eventLocation, eventStart, eventEnd, eventNote, cryptoType, cryptoAddr, cryptoAmount, socialPlatform, socialUsername, imageUrl]);

    // Initialize QR Code Styling
    useEffect(() => {
        let mounted = true;

        const initQRCode = async () => {
            const QRCodeStylingLib = (await import("qr-code-styling")).default;
            if (!mounted) return;

            const baseDotsOptions: any = {
                type: dotsStyle,
                color: useGradient ? undefined : fgColor
            };

            if (useGradient) {
                baseDotsOptions.gradient = {
                    type: gradientType,
                    rotation: (gradientRotation * Math.PI) / 180,
                    colorStops: [
                        { offset: 0, color: gradientColor1 },
                        { offset: 1, color: gradientColor2 }
                    ]
                };
            }

            const qr = new QRCodeStylingLib({
                width: 280,
                height: 280,
                type: "svg", // Render as SVG for better crispness default
                data: qrValue,
                image: logoSrc,
                dotsOptions: baseDotsOptions,
                cornersSquareOptions: {
                    color: fgColor, // Keep corners solid for scannability usually, or match fg
                    type: cornerSquareStyle
                },
                cornersDotOptions: {
                    color: fgColor,
                    type: cornerDotStyle
                },
                backgroundOptions: {
                    color: bgColor,
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 10
                }
            });

            if (qrRef.current) {
                qrRef.current.innerHTML = "";
                qr.append(qrRef.current);
                qrCode.current = qr;
            }
        };

        if (!qrCode.current) {
            initQRCode();
        } else {
            const baseDotsOptions: any = {
                type: dotsStyle,
                color: useGradient ? undefined : fgColor
            };

            if (useGradient) {
                baseDotsOptions.gradient = {
                    type: gradientType,
                    rotation: (gradientRotation * Math.PI) / 180,
                    colorStops: [
                        { offset: 0, color: gradientColor1 },
                        { offset: 1, color: gradientColor2 }
                    ]
                };
            }

            // Partial Update
            qrCode.current.update({
                data: qrValue,
                image: logoSrc,
                dotsOptions: baseDotsOptions,
                cornersSquareOptions: {
                    color: fgColor,
                    type: cornerSquareStyle
                },
                cornersDotOptions: {
                    color: fgColor,
                    type: cornerDotStyle
                },
                backgroundOptions: {
                    color: bgColor,
                }
            });
        }

        return () => {
            mounted = false;
        };
    }, [qrValue, logoSrc, fgColor, bgColor, dotsStyle, cornerSquareStyle, cornerDotStyle, useGradient, gradientColor1, gradientColor2, gradientType, gradientRotation]);

    const handleTabChange = (val: string) => {
        const newTab = val as TabType;
        setActiveTab(newTab);
        if (newTab !== 'style') {
            setLastContentTab(newTab);
        }
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (evt.target?.result) {
                    setLogoSrc(evt.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStyleReset = () => {
        setBgColor("#ffffff");
        setFgColor("#000000");
        setLogoSrc(undefined);
        setDotsStyle("square");
        setCornerSquareStyle("square");
        setCornerDotStyle("square");
        setUseGradient(false);
        setGradientColor1("#000000");
        setGradientColor2("#000000");
        setGradientRotation(0);
    };

    const downloadPNG = () => {
        qrCode.current?.download({ extension: "png", name: `monoqr-${activeTab === 'style' ? lastContentTab : activeTab}` });
    };

    const downloadSVG = () => {
        qrCode.current?.download({ extension: "svg", name: `monoqr-${activeTab === 'style' ? lastContentTab : activeTab}` });
    };

    const downloadPDF = async () => {
        // Native jsPDF implementation for consistent formatting
        if (!qrRef.current) return;

        try {
            const blob = await qrCode.current?.getRawData("png");
            if (!blob) return;

            import("jspdf").then((jsPDFModule) => {
                const jsPDF = jsPDFModule.default;
                const doc = new jsPDF();
                const url = URL.createObjectURL(blob as any);
                const img = new Image();
                img.src = url;

                img.onload = () => {
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const imgSize = 100;
                    const x = (pageWidth - imgSize) / 2;
                    const y = 60;

                    doc.setFontSize(20);
                    doc.text(title || "My QR Code", pageWidth / 2, 40, { align: "center" });
                    doc.addImage(img, "PNG", x, y, imgSize, imgSize);
                    doc.setFontSize(10);
                    doc.text(`Generated with MonoQR - ${activeTab === 'style' ? lastContentTab : activeTab}`, pageWidth / 2, y + imgSize + 10, { align: "center" });

                    doc.save(`monoqr-${activeTab === 'style' ? lastContentTab : activeTab}.pdf`);
                    URL.revokeObjectURL(url);
                };
            });
        } catch (e) {
            console.error("PDF generation failed", e);
        }
    };

    // Upload to Supabase Storage
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploadedFileName(file.name);
        setIsUploading(true);
        setUploadProgress(0);

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const fileName = `${uniqueId}.${fileExt}`;

        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 15;
            });
        }, 200);

        try {
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('Photo Upload')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            clearInterval(progressInterval);

            if (error) {
                console.error('Upload error:', error);
                alert('Upload failed. Please try again.');
                setIsUploading(false);
                setUploadProgress(0);
                return;
            }

            setUploadProgress(100);

            // Generate the viewer URL (not direct storage URL)
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://monoqr.com';
            const viewerUrl = `${origin}/i/${fileName}`;

            setImageUrl(viewerUrl);
            setIsUploading(false);
        } catch (err) {
            clearInterval(progressInterval);
            console.error('Upload error:', err);
            alert('Upload failed. Please try again.');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
                handleImageUpload({ target: { files: dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleReset = () => {
        setUrl(""); setText(""); setPhone("");
        setSmsPhone(""); setSmsMsg("");
        setEmailTo(""); setEmailSub(""); setEmailBody("");
        setWifiSsid(""); setWifiPassword("");
        setVcardName(""); setVcardPhone(""); setVcardEmail(""); setVcardOrg("");
        setLat(""); setLong("");
        setEventTitle(""); setEventLocation(""); setEventStart(""); setEventEnd(""); setEventNote("");
        setCryptoAddr(""); setCryptoAmount("");
        setSocialUsername("");
        setImageUrl(""); setUploadedFileName(""); setUploadProgress(0);
        setHasGenerated(false);
    };

    const handleGenerate = () => {
        setHasGenerated(true);
        if (onSave) {
            onSave({
                title: title,
                type: activeTab === 'style' ? lastContentTab : activeTab,
                content: qrValue,
                meta: {
                    color: fgColor,
                    bgColor: bgColor,
                    logo: logoSrc ? true : false,
                    style: { dotsStyle, cornerSquareStyle, cornerDotStyle }
                }
            });
        }
    };

    // Check if user has entered any meaningful content
    const hasUserContent = useMemo(() => {
        const actualTab = activeTab === "style" ? lastContentTab : activeTab;
        switch (actualTab) {
            case "url": return url.trim().length > 0;
            case "text": return text.trim().length > 0;
            case "phone": return phone.trim().length > 0;
            case "sms": return smsPhone.trim().length > 0 || smsMsg.trim().length > 0;
            case "email": return emailTo.trim().length > 0;
            case "wifi": return wifiSsid.trim().length > 0;
            case "vcard": return vcardName.trim().length > 0;
            case "location": return lat.trim().length > 0 || long.trim().length > 0;
            case "event": return eventTitle.trim().length > 0;
            case "crypto": return cryptoAddr.trim().length > 0;
            case "social": return socialUsername.trim().length > 0;
            case "image": return imageUrl.trim().length > 0;
            default: return false;
        }
    }, [activeTab, lastContentTab, url, text, phone, smsPhone, smsMsg, emailTo, wifiSsid, vcardName, lat, long, eventTitle, cryptoAddr, socialUsername, imageUrl]);

    return (
        <div className="w-full relative">


            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Panel - Control Center */}
                <div className="lg:col-span-7 space-y-8">
                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">
                        <div className="p-6 md:p-8">
                            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">QR Content</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                                            <Label htmlFor="pro-mode" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">Simulate Pro</Label>
                                            <Switch id="pro-mode" checked={isPro} onCheckedChange={setIsPro} className="scale-75" />
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-600">
                                            <Settings className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Tabs Grid */}
                                <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-auto bg-transparent p-0 mb-8 w-full">
                                    {tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.id}
                                            value={tab.id}
                                            className="flex items-center justify-center gap-2 h-12 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-medium data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800 hover:border-blue-300 transition-all shadow-sm group relative overflow-hidden"
                                        >
                                            {tab.icon}
                                            <span className="text-sm">
                                                {tab.label}
                                                {tab.id === 'style' && (
                                                    <span className="absolute top-0 right-0 bg-amber-400 text-[9px] font-bold px-1 text-amber-900 rounded-bl-sm">PRO</span>
                                                )}
                                            </span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {/* Input Form Area */}
                                <div className="space-y-6 min-h-[300px]">
                                    {onSave && (
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">QR Name</Label>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. My Website"
                                                className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                                            />
                                        </div>
                                    )}

                                    {/* Standard Tabs */}
                                    <TabsContent value="url" className="mt-0 animate-in fade-in duration-300">
                                        <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Website URL</Label>
                                        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <p className="mt-2 text-xs text-zinc-500">Enter the website URL you want to link to</p>
                                    </TabsContent>

                                    <TabsContent value="text" className="mt-0 animate-in fade-in duration-300">
                                        <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Plain Text</Label>
                                        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text here..." className="min-h-[140px] resize-none bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                    </TabsContent>

                                    <TabsContent value="wifi" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Network Name (SSID)</Label>
                                            <Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="WiFi Name" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</Label>
                                            <Input type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="Password" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                    </TabsContent>

                                    {/* ... Other Standard Tabs ... */}
                                    <TabsContent value="email" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <Input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder="Email To" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <Input value={emailSub} onChange={(e) => setEmailSub(e.target.value)} placeholder="Subject" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Message Body" className="min-h-[120px] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                    </TabsContent>

                                    <TabsContent value="sms" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <Input value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} placeholder="Phone Number" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <Textarea value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} placeholder="Message" className="min-h-[120px] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                    </TabsContent>

                                    <TabsContent value="phone" className="mt-0 animate-in fade-in duration-300">
                                        <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</Label>
                                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                    </TabsContent>

                                    <TabsContent value="social" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Platform</Label>
                                                <select
                                                    value={socialPlatform}
                                                    onChange={(e) => setSocialPlatform(e.target.value)}
                                                    className="w-full h-11 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm"
                                                >
                                                    <option value="twitter">X (Twitter)</option>
                                                    <option value="instagram">Instagram</option>
                                                    <option value="facebook">Facebook</option>
                                                    <option value="linkedin">LinkedIn</option>
                                                    <option value="youtube">YouTube</option>
                                                    <option value="github">GitHub</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">@</span>
                                                    <Input
                                                        value={socialUsername}
                                                        onChange={(e) => setSocialUsername(e.target.value)}
                                                        placeholder="username"
                                                        className="h-11 pl-8 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="vcard" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input value={vcardName} onChange={(e) => setVcardName(e.target.value)} placeholder="Full Name" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                            <Input value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} placeholder="Phone" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        </div>
                                        <Input value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} placeholder="Email" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <Input value={vcardOrg} onChange={(e) => setVcardOrg(e.target.value)} placeholder="Organization" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                    </TabsContent>

                                    <TabsContent value="location" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Latitude</Label>
                                                <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 40.7128" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                            </div>
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Longitude</Label>
                                                <Input value={long} onChange={(e) => setLong(e.target.value)} placeholder="e.g. -74.0060" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="event" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Event Title" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Location" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Start</Label>
                                                <Input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                            </div>
                                            <div>
                                                <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">End</Label>
                                                <Input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                            </div>
                                        </div>
                                        <Textarea value={eventNote} onChange={(e) => setEventNote(e.target.value)} placeholder="Description" className="min-h-[100px] bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                    </TabsContent>

                                    <TabsContent value="crypto" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                        <div className="flex gap-4 mb-2">
                                            <Button
                                                variant={cryptoType === 'bitcoin' ? 'default' : 'outline'}
                                                onClick={() => setCryptoType('bitcoin')}
                                                className="flex-1"
                                            >
                                                Bitcoin
                                            </Button>
                                            <Button
                                                variant={cryptoType === 'ethereum' ? 'default' : 'outline'}
                                                onClick={() => setCryptoType('ethereum')}
                                                className="flex-1"
                                            >
                                                Ethereum
                                            </Button>
                                        </div>
                                        <Input value={cryptoAddr} onChange={(e) => setCryptoAddr(e.target.value)} placeholder={`Enter ${cryptoType === 'bitcoin' ? 'BTC' : 'ETH'} Address`} className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                        <Input type="number" value={cryptoAmount} onChange={(e) => setCryptoAmount(e.target.value)} placeholder="Amount" className="h-11 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
                                    </TabsContent>

                                    {/* IMAGE UPLOAD TAB */}
                                    <TabsContent value="image" className="mt-0 animate-in fade-in duration-300">
                                        <Label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Image</Label>

                                        {/* Hidden File Input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                        {!imageUrl ? (
                                            <>
                                                {/* Upload Zone */}
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors bg-zinc-50 dark:bg-zinc-900/50"
                                                >
                                                    {isUploading ? (
                                                        <div className="space-y-4">
                                                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
                                                                <Upload className="w-6 h-6 text-zinc-500 animate-pulse" />
                                                            </div>
                                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Uploading {uploadedFileName}...</p>
                                                            <div className="w-full max-w-xs mx-auto bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                                                                <div
                                                                    className="bg-zinc-900 dark:bg-white h-full transition-all duration-300 ease-out"
                                                                    style={{ width: `${uploadProgress}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-zinc-500">{uploadProgress}%</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                                                <ImageIcon className="w-6 h-6 text-zinc-500" />
                                                            </div>
                                                            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                                                                Drop your image here or click to browse
                                                            </p>
                                                            <p className="text-xs text-zinc-500">
                                                                PNG, JPG, GIF up to 10MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            /* Uploaded State */
                                            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                                                        <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{uploadedFileName}</p>
                                                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Uploaded successfully</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setImageUrl("");
                                                            setUploadedFileName("");
                                                            setUploadProgress(0);
                                                        }}
                                                        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                                                    <Label className="text-xs text-zinc-500 mb-1 block">Generated URL</Label>
                                                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded block truncate text-zinc-600 dark:text-zinc-400">
                                                        {imageUrl}
                                                    </code>
                                                </div>
                                            </div>
                                        )}

                                        <p className="mt-3 text-xs text-zinc-500">
                                            Your image will be uploaded and a QR code will be generated linking to it.
                                        </p>
                                    </TabsContent>

                                    {/* STYLE TAB CONTENT WITH LOCK */}
                                    <TabsContent value="style" className="mt-0 animate-in fade-in duration-300 relative">
                                        {!isPro && (
                                            <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/70 dark:bg-zinc-950/70 flex flex-col items-center justify-center text-center p-8 rounded-xl">
                                                {/* Lock Icon with Amber Glow */}
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl scale-150"></div>
                                                    <div className="relative bg-white dark:bg-zinc-900 p-5 rounded-full shadow-lg ring-2 ring-amber-100 dark:ring-amber-900/30">
                                                        <Lock className="w-8 h-8 text-amber-500" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Unlock Brand Colors & Logos</h3>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[280px] mb-8">
                                                    Upgrade to Pro to customize your QR codes without limits.
                                                </p>
                                                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25 px-8 h-11 text-base font-semibold rounded-full">
                                                    Upgrade to Pro
                                                </Button>
                                            </div>
                                        )}

                                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!isPro ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                                            <div className="space-y-4">
                                                <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Body Shape</Label>
                                                <select
                                                    value={dotsStyle}
                                                    onChange={(e) => setDotsStyle(e.target.value as DotType)}
                                                    className="w-full h-11 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm"
                                                >
                                                    <option value="square">Square (Default)</option>
                                                    <option value="dots">Dots</option>
                                                    <option value="rounded">Rounded</option>
                                                    <option value="extra-rounded">Extra Rounded</option>
                                                    <option value="classy">Classy</option>
                                                    <option value="classy-rounded">Classy Rounded</option>
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Eye Frame Shape</Label>
                                                <select
                                                    value={cornerSquareStyle}
                                                    onChange={(e) => setCornerSquareStyle(e.target.value as CornerSquareType)}
                                                    className="w-full h-11 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm"
                                                >
                                                    <option value="square">Square</option>
                                                    <option value="dot">Dot</option>
                                                    <option value="extra-rounded">Extra Rounded</option>
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Eye Ball Shape</Label>
                                                <select
                                                    value={cornerDotStyle}
                                                    onChange={(e) => setCornerDotStyle(e.target.value as CornerDotType)}
                                                    className="w-full h-11 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm"
                                                >
                                                    <option value="square">Square</option>
                                                    <option value="dot">Dot</option>
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Detailed Colors</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor="gradient-mode" className="text-xs text-zinc-500">Gradient</Label>
                                                        <Switch id="gradient-mode" checked={useGradient} onCheckedChange={setUseGradient} className="scale-75" />
                                                    </div>
                                                </div>

                                                {!useGradient ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <span className="text-xs text-zinc-500">Solid Fill</span>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={fgColor}
                                                                    onChange={(e) => setFgColor(e.target.value)}
                                                                    className="h-10 w-full rounded cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <span className="text-xs text-zinc-500">Background</span>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={bgColor}
                                                                    onChange={(e) => setBgColor(e.target.value)}
                                                                    className="h-10 w-full rounded cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] uppercase font-bold text-zinc-400">Start Color</span>
                                                                <input
                                                                    type="color"
                                                                    value={gradientColor1}
                                                                    onChange={(e) => setGradientColor1(e.target.value)}
                                                                    className="h-8 w-full rounded cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] uppercase font-bold text-zinc-400">End Color</span>
                                                                <input
                                                                    type="color"
                                                                    value={gradientColor2}
                                                                    onChange={(e) => setGradientColor2(e.target.value)}
                                                                    className="h-8 w-full rounded cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-xs text-zinc-500">
                                                                <span>Rotation ({gradientRotation}°)</span>
                                                                <span>Type: {gradientType}</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="360"
                                                                value={gradientRotation}
                                                                onChange={(e) => setGradientRotation(parseInt(e.target.value))}
                                                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant={gradientType === 'linear' ? 'default' : 'outline'}
                                                                    onClick={() => setGradientType('linear')}
                                                                    className="flex-1 h-7 text-xs"
                                                                >
                                                                    Linear
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant={gradientType === 'radial' ? 'default' : 'outline'}
                                                                    onClick={() => setGradientType('radial')}
                                                                    className="flex-1 h-7 text-xs"
                                                                >
                                                                    Radial
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Logo Overlay</Label>
                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-200 dark:border-zinc-800 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-2 text-zinc-400" />
                                                        <p className="text-xs text-zinc-500">Click to upload logo</p>
                                                    </div>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                                </label>
                                                {logoSrc && (
                                                    <Button variant="outline" size="sm" onClick={() => setLogoSrc(undefined)} className="w-full text-red-500 hover:text-red-600">
                                                        Remove Logo
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                                        {activeTab === 'style' ? 'Design Mode' : `${qrValue.length} chars`}
                                    </span>
                                    <div className="flex gap-3">
                                        {activeTab === 'style' ? (
                                            <Button variant="ghost" size="sm" onClick={handleStyleReset} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Reset Design
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Reset
                                            </Button>
                                        )}

                                        {onSave ? (
                                            <Button
                                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                                                onClick={handleGenerate}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save to Dashboard"}
                                            </Button>
                                        ) : (
                                            <Button
                                                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-lg hover:shadow-xl transition-all"
                                                onClick={handleGenerate}
                                            >
                                                Generate QR Code
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Tabs>
                        </div>
                    </Card>
                </div>

                {/* Right Panel - Preview & Download */}
                <div className="lg:col-span-5">
                    <Card className="h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <h3 className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">Preview & Download</h3>
                        </div>

                        <div className="p-8 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 min-h-[400px]">

                            {hasUserContent || hasGenerated ? (
                                <>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                        <div className="bg-white p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm relative relative z-10" style={{ backgroundColor: bgColor }}>
                                            <div ref={qrRef} className="flex justify-center items-center">
                                                {/* QR Code instantiates here */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-wide">
                                            {activeTab === 'style' ? 'Customization' : activeTab}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                /* Placeholder State */
                                <div className="flex flex-col items-center justify-center text-center py-8">
                                    {/* Placeholder Icon Grid */}
                                    <div className="grid grid-cols-2 gap-1.5 mb-6">
                                        <div className="w-8 h-8 rounded-lg border-2 border-zinc-200 dark:border-zinc-700"></div>
                                        <div className="w-8 h-8 rounded-lg border-2 border-zinc-200 dark:border-zinc-700"></div>
                                        <div className="w-8 h-8 rounded-lg border-2 border-zinc-200 dark:border-zinc-700"></div>
                                        <div className="w-8 h-8 rounded-lg border-2 border-zinc-200 dark:border-zinc-700"></div>
                                    </div>
                                    <h4 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                        Your QR code will appear here
                                    </h4>
                                    <p className="text-sm text-zinc-400 dark:text-zinc-500">
                                        Click &quot;Generate QR Code&quot; to create
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="grid grid-cols-3 gap-3">
                                <Button
                                    variant="outline"
                                    className="h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-white hover:border-zinc-300 shadow-sm"
                                    onClick={downloadPNG}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    PNG
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`h-11 border-zinc-200 dark:border-zinc-800 shadow-sm ${!isPro ? 'opacity-60 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-white hover:border-zinc-300'}`}
                                    onClick={isPro ? downloadSVG : undefined}
                                >
                                    {!isPro ? <Lock className="w-3 h-3 mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                    {isPro ? "SVG" : "SVG (Pro)"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-white hover:border-zinc-300 shadow-sm"
                                    onClick={downloadPDF}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    PDF
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
