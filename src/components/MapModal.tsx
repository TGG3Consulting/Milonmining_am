import { useEffect, useMemo } from "react";

type Coords = { lat: number; lng: number };

export default function MapModal({
                                     title,
                                     address,
                                     coords,
                                     lang = "hy",
                                     onClose,
                                 }: {
    title: string;
    address: string;
    coords?: Coords;            // եթե կա, կստանանք “իրական” pin
    lang?: "hy" | "ru" | "en";  // UI լեզու
    onClose: () => void;
}) {
    // embed src — նախընտրում ենք coords-ը, որ pin-ը հստակ լինի (q=loc:lat,lng)
    const src = useMemo(() => {
        if (coords) {
            return `https://www.google.com/maps?q=loc:${coords.lat},${coords.lng}&hl=${lang}&z=16&output=embed`;
        }
        return `https://www.google.com/maps?q=${encodeURIComponent(address)}&hl=${lang}&z=16&output=embed`;
    }, [coords, address, lang]);

    // բացելու հնարավորություն հիմնական Maps-ում (external link)
    const gmapsLink = useMemo(() => {
        return coords
            ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
            : `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    }, [coords, address]);

    // ESC → փակել
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm grid place-items-center p-4">
            <div className="w-[min(100%,760px)] rounded-2xl bg-white shadow-2xl border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <div className="flex items-center gap-2">
                        <a
                            href={gmapsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm px-2 py-1 rounded-md border hover:bg-slate-50"
                        >
                            Բացել Google Maps-ում
                        </a>
                        <button
                            onClick={onClose}
                            className="rounded-md px-2 py-1 text-sm hover:bg-slate-100"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {/* Խուսափում ենք controls-ի clipping-ից: overflow:hidden-ը դրված չէ wrapper-ին,
              borderRadius-ը տալիս ենք հենց iframe-ին */}
                    <div className="relative w-full h-[360px] rounded-xl border bg-white">
                        <iframe
                            title={title}
                            src={src}
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: 12, display: "block" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            // allowFullScreen
                        />
                    </div>

                    <div className="text-xs text-black/60 mt-2">{address}</div>
                </div>
            </div>
        </div>
    );
}
