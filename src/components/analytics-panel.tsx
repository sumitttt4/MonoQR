"use client";

import { useMemo } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { MOCK_ANALYTICS, MOCK_QRS } from "@/lib/mock-data";
import { Globe, Smartphone, Monitor, MapPin } from "lucide-react";

interface AnalyticsPanelProps {
    qrId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AnalyticsPanel({ qrId, isOpen, onClose }: AnalyticsPanelProps) {
    const qr = MOCK_QRS.find((q) => q.id === qrId);
    // Type assertion or fallback for safety if ID doesn't exist in mock
    const stats = qrId ? (MOCK_ANALYTICS as any)[qrId] : null;

    // Transform data for chart
    const chartData = useMemo(() => {
        if (!stats) return [];
        // Mock days labels
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return stats.dailyScans.map((count: number, i: number) => ({
            name: days[i],
            scans: count,
        }));
    }, [stats]);

    if (!qr) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="mb-8">
                    <SheetTitle className="text-2xl font-bold text-zinc-900">
                        Analytics Report
                    </SheetTitle>
                    <SheetDescription className="text-zinc-500">
                        Real-time performance for <span className="font-semibold text-blue-600">{qr.name}</span>
                    </SheetDescription>
                </SheetHeader>

                {stats ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* KPI Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                <span className="text-sm text-zinc-500">Total Scans</span>
                                <div className="text-3xl font-bold text-zinc-900 mt-1">{qr.scans.toLocaleString()}</div>
                                <div className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                                    ▲ 12% vs last week
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                <span className="text-sm text-zinc-500">Unique Devices</span>
                                <div className="text-3xl font-bold text-zinc-900 mt-1">{(qr.scans * 0.85).toFixed(0)}</div>
                                <div className="text-xs text-zinc-400 font-medium mt-2">
                                    85% uniqueness
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-[250px] w-full">
                            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Activity (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#888888" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        cursor={{ fill: '#f4f4f5' }}
                                    />
                                    <Bar dataKey="scans" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#2563eb' : '#e4e4e7'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Breakdown Lists */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Device Types */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-zinc-400" /> Devices
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2"><Smartphone className="w-3 h-3 text-zinc-400" /> Mobile</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${stats.devices.mobile}%` }} />
                                            </div>
                                            <span className="text-zinc-600 font-medium">{stats.devices.mobile}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2"><Monitor className="w-3 h-3 text-zinc-400" /> Desktop</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-zinc-400" style={{ width: `${stats.devices.desktop}%` }} />
                                            </div>
                                            <span className="text-zinc-600 font-medium">{stats.devices.desktop}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Locations */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-zinc-400" /> Locations
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.locations).map(([country, percent]: [string, any]) => (
                                        <div key={country} className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-600">{country}</span>
                                            <span className="font-medium text-zinc-900">{percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6 text-zinc-300" />
                        </div>
                        <p className="text-zinc-500">No analytics data available yet.</p>
                        <p className="text-xs text-zinc-400 mt-2">Try scanning the code to generate data.</p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
