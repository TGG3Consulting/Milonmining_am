// src/components/SkyBlueprintBg.tsx
import React from "react";

type Bubble = {
    size: number; left: string; top: string; blur: number; opacity: number; dur: number; delay: number;
};

const BUBBLES: Bubble[] = [
    { size: 320, left: "7%",  top: "12%", blur: 10, opacity: 0.22, dur: 11, delay: 0   },
    { size: 260, left: "72%", top: "8%",  blur: 12, opacity: 0.20, dur: 12, delay: 1.2 },
    { size: 220, left: "58%", top: "40%", blur: 14, opacity: 0.18, dur: 10, delay: 0.4 },
    { size: 300, left: "20%", top: "56%", blur: 16, opacity: 0.20, dur: 13, delay: 0.8 },
    { size: 180, left: "85%", top: "58%", blur: 10, opacity: 0.20, dur:  9, delay: 1.8 },
    { size: 180, left: "35%", top: "80%", blur: 12, opacity: 0.18, dur: 12, delay: 0.6 },
    { size: 140, left: "10%", top: "82%", blur: 10, opacity: 0.22, dur: 10, delay: 2.1 },
];

type PaletteKey = "slate" | "sand" | "purple";
const PALETTES: Record<PaletteKey, Record<string, string>> = {
    // ✅ նոր default — չեզոք «բետոն/մետաղ» գամմա
    slate: {
        baseFrom: "#f8fafc", // slate-50
        baseVia:  "#ffffff",
        grid:  "rgba(100,116,139,0.13)", // slate-500
        dots:  "rgba(100,116,139,0.14)",
        diag1: "rgba(100,116,139,0.10)",
        diag2: "rgba(100,116,139,0.06)",
        glow1: "rgba(148,163,184,0.30)", // slate-400
        glow2: "rgba(71,85,105,0.24)",   // slate-600
        glow3: "rgba(148,163,184,0.22)",
        bubble1: "rgba(148,163,184,0.45)",
        bubble2: "rgba(100,116,139,0.28)",
        bubble3: "rgba(100,116,139,0.14)",
        skyline: "rgba(148,163,184,0.65)",
    },
    // Տաք, «ավազ/քար» գամմա (ցանկության դեպքում palette="sand")
    sand: {
        baseFrom: "#fdf7ed", // amber/stone-50 mix
        baseVia:  "#ffffff",
        grid:  "rgba(180,137,88,0.16)",   // warm lines
        dots:  "rgba(180,137,88,0.16)",
        diag1: "rgba(180,137,88,0.10)",
        diag2: "rgba(180,137,88,0.06)",
        glow1: "rgba(245,158,11,0.22)",   // amber-500
        glow2: "rgba(234,179,8,0.18)",    // amber-400
        glow3: "rgba(120,113,108,0.18)",  // stone-500
        bubble1: "rgba(245,158,11,0.40)",
        bubble2: "rgba(234,179,8,0.26)",
        bubble3: "rgba(120,113,108,0.14)",
        skyline: "rgba(168,162,158,0.65)", // stone-400
    },
    // Նախորդ պուրպուր գամմա (եթե ուզես palette="purple")
    purple: {
        baseFrom: "#faf5ff", // fuchsia-50-ish
        baseVia:  "#ffffff",
        grid:  "rgba(139,92,246,0.13)",
        dots:  "rgba(139,92,246,0.14)",
        diag1: "rgba(139,92,246,0.10)",
        diag2: "rgba(139,92,246,0.06)",
        glow1: "rgba(168,85,247,0.30)",
        glow2: "rgba(139,92,246,0.24)",
        glow3: "rgba(99,102,241,0.18)",
        bubble1: "rgba(168,85,247,0.55)",
        bubble2: "rgba(139,92,246,0.35)",
        bubble3: "rgba(139,92,246,0.20)",
        skyline: "rgba(139,92,246,0.65)",
    },
};

export default function SkyBlueprintBg({
                                           global = true,
                                           showSkyline = true,
                                           palette = "slate",
                                       }: {
    global?: boolean;
    showSkyline?: boolean;
    palette?: PaletteKey;
}) {
    const p = PALETTES[palette];

    return (
        <div
            className={`${global ? "fixed" : "absolute"} inset-0 -z-10 pointer-events-none overflow-hidden`}
            // CSS variables — օգտագործում ենք ներքևի style բլոկում
            style={
                {
                    // base
                    ["--base-from" as any]: p.baseFrom,
                    ["--base-via"  as any]: p.baseVia,
                    // lines
                    ["--grid" as any]:  p.grid,
                    ["--dots" as any]:  p.dots,
                    ["--diag1" as any]: p.diag1,
                    ["--diag2" as any]: p.diag2,
                    // glows
                    ["--glow1" as any]: p.glow1,
                    ["--glow2" as any]: p.glow2,
                    ["--glow3" as any]: p.glow3,
                    // bubbles
                    ["--b1" as any]: p.bubble1,
                    ["--b2" as any]: p.bubble2,
                    ["--b3" as any]: p.bubble3,
                    // skyline
                    ["--skyline" as any]: p.skyline,
                } as React.CSSProperties
            }
        >
            {/* Base gradient */}
            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, var(--base-from), var(--base-via), #ffffff)" }}
            />

            {/* Glows */}
            <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-[1400px] h-[640px] rounded-full blur-3xl" style={{ background: "var(--glow1)" }} />
            <div className="absolute top-28 -right-28 w-[460px] h-[460px] rounded-full blur-3xl" style={{ background: "var(--glow2)" }} />
            <div className="absolute bottom-[-80px] -left-24 w-[420px] h-[420px] rounded-full blur-3xl" style={{ background: "var(--glow3)" }} />

            {/* Blueprint layers (քառակուսիները պահում ենք) */}
            <div className="absolute inset-0 opacity-55 blueprint-grid" />
            <div className="absolute inset-0 opacity-35 blueprint-dots" />
            <div className="absolute inset-0 opacity-20 blueprint-diagonals" />

            {/* Bubbles */}
            {BUBBLES.map((b, i) => (
                <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: b.size, height: b.size, left: b.left, top: b.top,
                        opacity: b.opacity, filter: `blur(${b.blur}px)`,
                        animation: `float ${b.dur}s ease-in-out ${b.delay}s infinite alternate`,
                        background: "radial-gradient(circle at 30% 30%, var(--b1), var(--b2), var(--b3), rgba(0,0,0,0))",
                    }}
                />
            ))}

            {/* Skyline (թույլ «քաղաք») */}
            {showSkyline && (
                <div className="absolute bottom-[-2px] left-0 right-0 h-[170px]">
                    <div className="absolute bottom-0 w-full h-[1px]" style={{ background: "color-mix(in oklab, var(--skyline) 80%, transparent)" }} />
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute bottom-0 rounded-t-md"
                            style={{
                                left: `${i * 8 + (i % 2 ? 2 : 0)}%`,
                                width: `${6 + (i % 3)}%`,
                                height: `${90 + (i % 5) * 22}px`,
                                background: "linear-gradient(to top, var(--skyline), rgba(255,255,255,0))",
                                filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.08))",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Local CSS */}
            <style>{`
        .blueprint-grid {
          background-image:
            linear-gradient(to right, var(--grid) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(to bottom, black, black 70%, transparent);
        }
        .blueprint-dots {
          background-image: radial-gradient(var(--dots) 1px, transparent 1.8px);
          background-size: 24px 24px;
          mask-image: linear-gradient(to bottom, black, black 55%, transparent);
        }
        .blueprint-diagonals {
          background-image:
            linear-gradient(135deg, var(--diag1) 0 1px, transparent 1px 100%),
            linear-gradient(45deg, var(--diag2) 0 1px, transparent 1px 100%);
          background-size: 20px 20px, 28px 28px;
          mask-image: radial-gradient(1200px 420px at 50% -120px, black, transparent 70%);
        }
        @keyframes float {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(14px, -20px, 0) scale(1.03); }
        }
        @media (prefers-reduced-motion: reduce) { span[style*="radial-gradient"] { animation: none !important; } }
      `}</style>
        </div>
    );
}
