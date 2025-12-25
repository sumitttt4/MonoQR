import React from 'react';
import { Type, MapPin, Image as ImageIcon, QrCode, FileText, Link2, Mail, Wifi, Layers, Shield, Lock, Flame, Bug, Skull, Fish } from 'lucide-react';


// Common 3D container styles
const Container3D = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative w-full h-full flex items-center justify-center perspective-[1000px] ${className}`}>
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
            {children}
        </div>
    </div>
);

export const SpeedShape = () => {
    // Icons that will converge into the center
    const Icons = [
        { Icon: Link2, delay: 0, x: -120, y: 0 },
        { Icon: Mail, delay: 2, x: 120, y: 0 },
        { Icon: Wifi, delay: 1, x: 0, y: -120 },
        { Icon: MapPin, delay: 3, x: 0, y: 120 },
        { Icon: ImageIcon, delay: 1.5, x: -85, y: -85 },
        { Icon: Layers, delay: 2.5, x: 85, y: 85 },
        { Icon: FileText, delay: 0.5, x: 85, y: -85 },
        { Icon: Type, delay: 3.5, x: -85, y: 85 },
    ];

    return (
        <Container3D>
            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes converge {
                        0% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.5); }
                        10% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1); }
                        80% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1); }
                        100% { opacity: 0; transform: translate(0, 0) scale(0.2); }
                    }
                    .animate-converge {
                        animation: converge 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    }
                `}} />

                {/* Converging Inputs */}
                {Icons.map(({ Icon, delay, x, y }, i) => (
                    <div
                        key={i}
                        className="absolute w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shadow-xl animate-converge z-10"
                        style={{
                            '--tx': `${x}px`,
                            '--ty': `${y}px`,
                            animationDelay: `${delay}s`
                        } as React.CSSProperties}
                    >
                        <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
                    </div>
                ))}

                {/* Central Processor / Logo (The "Real" 3D Icon) */}
                <div className="relative z-20 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(59,130,246,0.6)] animate-pulse-glow border-[6px] border-white dark:border-zinc-900 ring-1 ring-zinc-900/5">
                    <QrCode className="w-16 h-16 text-white" strokeWidth={2.5} />

                    {/* Glossy Reflection */}
                    <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-tr from-white/30 via-transparent to-transparent pointer-events-none" />
                    {/* Internal Glow */}
                    <div className="absolute inset-0 rounded-[1.5rem] bg-blue-400/20 blur-xl pointer-events-none" />
                </div>
            </div>
        </Container3D>
    );
};

export const ExportShape = () => (
    <Container3D>
        <div className="absolute inset-0 flex items-center justify-center">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
            `}} />

            {/* SVG Card - Left, Tilted */}
            <div className="absolute w-20 h-24 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 flex flex-col items-center justify-center transform -translate-x-14 translate-y-2 -rotate-12 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                </div>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">SVG</span>
                <span className="text-[10px] text-zinc-400">Vector</span>
            </div>

            {/* PNG Card - Right, Tilted */}
            <div className="absolute w-20 h-24 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 flex flex-col items-center justify-center transform translate-x-14 translate-y-2 rotate-12 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                </div>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">PNG</span>
                <span className="text-[10px] text-zinc-400">Raster</span>
            </div>

            {/* PDF Card - Center, Larger, Forward */}
            <div className="relative z-20 w-24 h-28 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700 flex flex-col items-center justify-center animate-float-gentle cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-lg">PDF</span>
                <span className="text-xs text-zinc-400">Print Ready</span>
            </div>
        </div>
    </Container3D>
);

export const PrivacyShape = () => {
    // Threat icons that orbit around
    const threats = [
        { Icon: Flame, color: 'orange', x: -90, y: -60, delay: 0 },
        { Icon: Bug, color: 'emerald', x: -100, y: 40, delay: 0.5 },
        { Icon: Fish, color: 'zinc', x: 90, y: -50, delay: 1 },  // Phishing
        { Icon: Skull, color: 'red', x: 85, y: 50, delay: 1.5 },
        { Icon: Mail, color: 'red', x: 60, y: -80, delay: 2 },    // Spam
    ];

    return (
        <Container3D>
            <div className="absolute inset-0 flex items-center justify-center">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scan-eye {
                        0%, 100% { transform: translateX(-3px); }
                        50% { transform: translateX(3px); }
                    }
                    @keyframes threat-float {
                        0%, 100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0.7; }
                        50% { transform: translate(calc(var(--tx) * 0.7), calc(var(--ty) * 0.7)) scale(0.9); opacity: 0.4; }
                    }
                    @keyframes shield-pulse {
                        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                        50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.2); }
                    }
                    @keyframes net-pulse {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 0.5; }
                    }
                    @keyframes binary-scroll {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    .animate-scan-eye { animation: scan-eye 2s ease-in-out infinite; }
                    .animate-threat { animation: threat-float 4s ease-in-out infinite; }
                    .animate-shield-pulse { animation: shield-pulse 3s ease-in-out infinite; }
                    .animate-net-pulse { animation: net-pulse 2s ease-in-out infinite; }
                    .animate-binary { animation: binary-scroll 8s linear infinite; }
                `}} />

                {/* Background Browser Window */}
                <div className="absolute w-40 h-32 bg-white/80 dark:bg-zinc-800/80 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-lg -translate-x-6 -translate-y-4 overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="h-5 bg-emerald-50 dark:bg-emerald-900/30 border-b border-emerald-100 dark:border-emerald-800 flex items-center px-2 gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    {/* Content: QR + Binary */}
                    <div className="flex h-full">
                        <div className="w-16 h-16 m-2 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center">
                            <QrCode className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 overflow-hidden text-[6px] text-emerald-400/60 font-mono leading-tight p-1">
                            <div className="animate-binary">
                                10110101<br />01101001<br />11010110<br />00101101<br />10110010<br />01001011<br />
                                10110101<br />01101001<br />11010110<br />00101101<br />10110010<br />01001011<br />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Protective Net Lines */}
                <svg className="absolute w-full h-full animate-net-pulse pointer-events-none" viewBox="0 0 200 200">
                    <defs>
                        <radialGradient id="netGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    {[20, 40, 60, 80, 100].map((r, i) => (
                        <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="url(#netGrad)" strokeWidth="0.5" />
                    ))}
                    {[0, 30, 60, 90, 120, 150].map((angle, i) => (
                        <line key={i} x1="100" y1="100" x2={100 + 100 * Math.cos(angle * Math.PI / 180)} y2={100 + 100 * Math.sin(angle * Math.PI / 180)} stroke="url(#netGrad)" strokeWidth="0.5" />
                    ))}
                </svg>

                {/* Floating Threat Icons */}
                {threats.map(({ Icon, color, x, y, delay }, i) => (
                    <div
                        key={i}
                        className={`absolute w-8 h-8 rounded-lg bg-${color}-100 dark:bg-${color}-900/40 border border-${color}-200 dark:border-${color}-800 flex items-center justify-center shadow-lg animate-threat`}
                        style={{ '--tx': `${x}px`, '--ty': `${y}px`, animationDelay: `${delay}s` } as React.CSSProperties}
                    >
                        <Icon className={`w-4 h-4 text-${color}-500`} />
                    </div>
                ))}

                {/* Robot + Shield (Main Focus) */}
                <div className="relative z-20 flex flex-col items-center">
                    {/* Robot Head */}
                    <div className="relative w-20 h-16 bg-white dark:bg-zinc-100 rounded-[1.2rem] border border-zinc-200 shadow-xl flex items-center justify-center">
                        {/* Antenna */}
                        <div className="absolute -top-5 w-1.5 h-5 bg-zinc-300 rounded-full">
                            <div className="absolute -top-1.5 -left-1 w-3.5 h-3.5 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] animate-pulse"></div>
                        </div>
                        {/* Visor */}
                        <div className="w-14 h-7 bg-zinc-900 rounded-full flex items-center justify-center gap-4 overflow-hidden">
                            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-scan-eye shadow-[0_0_10px_#60a5fa]"></div>
                            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-scan-eye shadow-[0_0_10px_#60a5fa]"></div>
                        </div>
                    </div>

                    {/* Robot Body + Shield */}
                    <div className="relative -mt-2 w-24 h-20 bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-200 dark:to-zinc-300 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                        {/* Shield */}
                        <div className="relative w-14 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-b-[2rem] rounded-t-lg flex items-center justify-center shadow-xl animate-shield-pulse border-2 border-emerald-300">
                            <Shield className="w-7 h-7 text-white drop-shadow-lg" />
                            {/* Shield Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent rounded-b-[2rem] rounded-t-lg pointer-events-none"></div>
                        </div>
                        {/* Arm hint */}
                        <div className="absolute -left-3 top-4 w-4 h-8 bg-zinc-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </Container3D>
    );
};

export const ResponsiveShape = () => (
    <Container3D>
        {/* 4 QR Slideshow - Cycling One by One */}
        <div className="absolute inset-0 flex items-center justify-center">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideshow {
                    0%, 20% { opacity: 1; transform: scale(1) translateY(0); z-index: 10; }
                    25%, 100% { opacity: 0; transform: scale(0.9) translateY(10px); z-index: 0; }
                }
                .slide-item {
                    position: absolute;
                    animation: slideshow 8s infinite;
                }
            `}} />

            {/* Card 1: Standard Blue */}
            <div className="slide-item w-28 h-28 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 flex items-center justify-center" style={{ animationDelay: '0s' }}>
                <QrCode className="w-16 h-16 text-blue-500" />
                <div className="absolute bottom-2 text-[10px] font-bold text-blue-500/50">Classic</div>
            </div>

            {/* Card 2: Rounded Dots (Styled) */}
            <div className="slide-item w-28 h-28 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900 flex items-center justify-center" style={{ animationDelay: '2s' }}>
                <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div key={i} className="w-4 h-4 bg-purple-500 rounded-full"></div>)}
                </div>
                <div className="absolute bottom-2 text-[10px] font-bold text-purple-500/50">Rounded</div>
            </div>

            {/* Card 3: Image Center (Photo) */}
            <div className="slide-item w-28 h-28 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-pink-100 dark:border-pink-900 flex items-center justify-center" style={{ animationDelay: '4s' }}>
                <div className="relative w-16 h-16 border-2 border-pink-200 dark:border-pink-800 rounded-lg p-1">
                    <div className="w-full h-full bg-pink-100 dark:bg-pink-900/30 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-pink-500" />
                    </div>
                    {/* Corner Markers */}
                    <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-l-2 border-t-2 border-pink-500"></div>
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-r-2 border-t-2 border-pink-500"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-l-2 border-b-2 border-pink-500"></div>
                </div>
                <div className="absolute bottom-2 text-[10px] font-bold text-pink-500/50">Brand Logo</div>
            </div>

            {/* Card 4: Gradient / Art */}
            <div className="slide-item w-28 h-28 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900 flex items-center justify-center overflow-hidden" style={{ animationDelay: '6s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 opacity-20"></div>
                <QrCode className="w-16 h-16 text-emerald-600 dark:text-emerald-400 relative z-10" />
                <div className="absolute bottom-2 text-[10px] font-bold text-emerald-600/50 relative z-10">Artistic</div>
            </div>

            {/* Base/Deck to show stack depth */}
            <div className="absolute w-28 h-28 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl transform scale-90 translate-y-2 -z-10 border border-dashed border-zinc-200 dark:border-zinc-700"></div>
        </div>
    </Container3D>
);
