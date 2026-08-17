// src/components/GalleryModal.tsx
import { useEffect, useRef, useState } from "react";

export default function GalleryModal({
                                         images,
                                         index = 0,
                                         onClose,
                                         onPrev,
                                         onNext,
                                     }: {
    images: string[];
    index?: number;
    onClose: () => void;
    onPrev: () => void;   // will still be called after local change (optional side effects)
    onNext: () => void;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);

    // ---- make it self-controlled ----
    const [current, setCurrent] = useState(() => clampIndex(index, images.length));
    useEffect(() => {
        // If props change (new images or new start index), resync
        setCurrent(clampIndex(index, images.length));
    }, [index, images.length]);

    const hasMultiple = images.length > 1;

    const goPrev = () => {
        if (!hasMultiple) return;
        setCurrent((c) => (c - 1 + images.length) % images.length);
        onPrev?.();
    };
    const goNext = () => {
        if (!hasMultiple) return;
        setCurrent((c) => (c + 1) % images.length);
        onNext?.();
    };

    // keyboard: Esc / ← / →
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (hasMultiple && e.key === "ArrowLeft") goPrev();
            if (hasMultiple && e.key === "ArrowRight") goNext();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose, hasMultiple]); // goPrev/goNext capture latest images.length via state

    // auto-hide controls when idle
    const [idle, setIdle] = useState(false);
    useEffect(() => {
        let t: number | undefined;
        const reset = () => {
            setIdle(false);
            window.clearTimeout(t);
            t = window.setTimeout(() => setIdle(true), 1400);
        };
        reset();
        const el = wrapRef.current;
        el?.addEventListener("mousemove", reset, { passive: true });
        el?.addEventListener("touchstart", reset, { passive: true });
        return () => {
            el?.removeEventListener("mousemove", reset as any);
            el?.removeEventListener("touchstart", reset as any);
            window.clearTimeout(t);
        };
    }, []);

    return (
        <div
            ref={wrapRef}
            className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm grid place-items-center p-4 animate-modal-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-5xl aspect-video bg-black/10 rounded-2xl overflow-hidden ring-1 ring-white/20">
                {/* image — crossfade on change via key */}
                <img
                    key={current}
                    src={images[current]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain select-none animate-fade-in"
                    draggable={false}
                />

                {/* arrows (only if >1) */}
                {hasMultiple && (
                    <>
                        <NavArrow
                            side="left"
                            hidden={idle}
                            onClick={(e) => {
                                e.stopPropagation();
                                goPrev();
                            }}
                            ariaLabel="Prev image"
                        />
                        <NavArrow
                            side="right"
                            hidden={idle}
                            onClick={(e) => {
                                e.stopPropagation();
                                goNext();
                            }}
                            ariaLabel="Next image"
                        />
                    </>
                )}

                {/* close */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-3 right-3 z-20 rounded-full px-3 py-1 text-xs font-medium
                     bg-white/85 text-slate-800 shadow-md hover:bg-white focus:outline-none
                     focus:ring-2 focus:ring-slate-400/70 transition"
                >
                    × փակել
                </button>

                {/* index (hide when only 1) */}
                {hasMultiple && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/90 bg-black/40 rounded-full px-2 py-0.5">
                        {current + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* local animations */}
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.995); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn .24s ease-out; }
        @keyframes modalIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-modal-in { animation: modalIn .18s ease-out; }
      `}</style>
        </div>
    );
}

function NavArrow({
                      side,
                      hidden,
                      onClick,
                      ariaLabel,
                  }: {
    side: "left" | "right";
    hidden?: boolean;
    onClick: (e: React.MouseEvent) => void;
    ariaLabel: string;
}) {
    const isLeft = side === "left";
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={`group absolute ${isLeft ? "left-4" : "right-4"} top-1/2 -translate-y-1/2
                  h-11 w-11 sm:h-12 sm:w-12 grid place-items-center rounded-full
                  bg-gradient-to-b from-white/95 to-white/80 text-slate-800
                  shadow-[0_10px_25px_rgba(0,0,0,.25)] ring-1 ring-black/5 backdrop-blur
                  hover:from-white hover:to-white active:scale-95 transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70
                  duration-300
                  ${hidden ? `${isLeft ? "-translate-x-2" : "translate-x-2"} opacity-0` : "translate-x-0 opacity-100"}`}
        >
            <span className="absolute inset-0 rounded-full bg-white/40 blur-md opacity-0 group-hover:opacity-100 transition" />
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="relative"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: isLeft ? "none" : "scaleX(-1)" }}
            >
                <path d="M15 6l-6 6 6 6" />
            </svg>
        </button>
    );
}

// small helper
function clampIndex(i: number, len: number) {
    if (!len) return 0;
    return Math.min(Math.max(i, 0), len - 1);
}
