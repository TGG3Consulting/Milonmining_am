import { useEffect, useRef, useState } from "react";
import GalleryModal from "./GalleryModal";
import { useTranslation } from "react-i18next";
import MapModal from "./MapModal";
export type Project = {
    id: string;
    name: string;
    address: string;
    start: string;   // ISO date
    end: string;     // ISO date
    units: number;
    areaMin: number;
    areaMax: number;
    parking: number;
    floors_qty: number;
    images: string[];
    main_image?: string;
    coords?: { lat: number; lng: number };
};

const MONTHS: Record<string, string[]> = {
    hy: ["Հունվար","Փետրվար","Մարտ","Ապրիլ","Մայիս","Հունիս","Հուլիս","Օգոստոս","Սեպտեմբեր","Հոկտեմբեր","Նոյեմբեր","Դեկտեմբեր"],
    ru: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};

function formatRange(d1: Date, d2: Date, lang: "hy" | "ru" | "en" = "hy") {
    const m = MONTHS[lang] ?? MONTHS.en;
    return `${m[d1.getMonth()]} ${d1.getFullYear()} - ${m[d2.getMonth()]} ${d2.getFullYear()}`;
}

function calcProgress(start: Date, end: Date) {
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const done = Math.min(Math.max(now.getTime() - start.getTime(), 0), total);
    return total > 0 ? Math.round((done / total) * 100) : 0;
}

export default function ProjectCarousel({
                                            projects,
                                            onBook,
                                        }: {
    projects: Project[];
    onBook?: (p: Project) => void;
}) {
    const { t, i18n } = useTranslation();
    const scroller = useRef<HTMLDivElement>(null);

    // modal state
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [slideIdx, setSlideIdx] = useState(0);
    const [mapOpen, setMapOpen] = useState(false);
    const [mapIdx, setMapIdx] = useState(0);

    // arrow visibility state
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const updateArrows = () => {
        const el = scroller.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        const atStart = el.scrollLeft <= 2;
        const atEnd = el.scrollLeft >= maxScroll - 2;
        setCanLeft(!atStart);
        setCanRight(!atEnd);
        if (maxScroll <= 0) {
            setCanLeft(false);
            setCanRight(false);
        }
    };

    useEffect(() => {
        updateArrows();
        const el = scroller.current;
        if (!el) return;

        const onScroll = () => updateArrows();
        el.addEventListener("scroll", onScroll, { passive: true });

        const ro = new ResizeObserver(updateArrows);
        ro.observe(el);

        const iid = window.setInterval(updateArrows, 400); // images may change width
        return () => {
            el.removeEventListener("scroll", onScroll);
            ro.disconnect();
            window.clearInterval(iid);
        };
    }, [projects.length]);

    const openGallery = (idx: number) => {
        setActiveIdx(idx);
        setSlideIdx(0);
        setOpen(true);
    };
    const goPrev = () =>
        setSlideIdx(
            (i) =>
                (i - 1 + projects[activeIdx].images.length) %
                projects[activeIdx].images.length
        );
    const goNext = () =>
        setSlideIdx((i) => (i + 1) % projects[activeIdx].images.length);

    // locale (future use if you format differently by lang)
    // const locale = (i18n.language as "hy" | "ru") || "hy";

    return (
        <>
            <div className="relative">
                {/* edge fades — only show when there is scroll that way */}
                {canLeft && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent rounded-l-2xl" />
                )}
                {canRight && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent rounded-r-2xl" />
                )}

                {/* left arrow (subtle) */}
                {canLeft && (
                    <button
                        onClick={() =>
                            scroller.current?.scrollBy({ left: -360, behavior: "smooth" })
                        }
                        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10
                       h-9 w-9 items-center justify-center rounded-full
                       bg-white/60 backdrop-blur border border-black/5 shadow-sm
                       text-slate-700 hover:bg-white transition
                       hover:shadow-md active:scale-95"
                        aria-label="Prev"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15 6l-6 6 6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}

                {/* right arrow (subtle) */}
                {canRight && (
                    <button
                        onClick={() =>
                            scroller.current?.scrollBy({ left: 360, behavior: "smooth" })
                        }
                        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10
                       h-9 w-9 items-center justify-center rounded-full
                       bg-white/60 backdrop-blur border border-black/5 shadow-sm
                       text-slate-700 hover:bg-white transition
                       hover:shadow-md active:scale-95"
                        aria-label="Next"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}

                {/* scrollable track */}
                <div
                    ref={scroller}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth"
                >
                    {projects.map((p, idx) => {
                        const start = new Date(p.start);
                        const end = new Date(p.end);
                        const progress = calcProgress(start, end);
                        const lang = (i18n.language === "ru" ? "ru" : i18n.language === "hy" ? "hy" : "en");
                        const dateStr = formatRange(start, end, lang);

                        return (
                            <article
                                key={p.id}
                                className="min-w-[320px] max-w-[360px] snap-center rounded-2xl bg-white border shadow-sm overflow-hidden"
                            >
                                {/* cover */}
                                <div className="relative h-80 bg-slate-100">
                                    <img
                                        src={p.main_image}
                                        alt={p.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onLoad={updateArrows}
                                    />
                                    <button
                                        onClick={() => openGallery(idx)}
                                        className="absolute right-2 bottom-2 text-xs bg-white/90 hover:bg-white rounded-full px-3 py-1 shadow"
                                    >
                                        {t("home.viewPhotos", "Դիտել լուսանկարները")}
                                    </button>
                                </div>

                                {/* content */}
                                <div className="p-5 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-4 text-center">
                                        <h3 className="text-[20px] font-semibold leading-tight">
                                            {p.name}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => { setMapIdx(idx); setMapOpen(true); }}
                                            className="text-[15px] text-black/70 underline decoration-dotted hover:decoration-solid hover:text-black transition"
                                            aria-label="Show on map"
                                        >
                                            {p.address}
                                        </button>
                                    </div>

                                    {/* dates + progress */}
                                    <div>
                                        <div className="text-[14px] font-bold text-black/80 mb-1">📅 {dateStr}</div>
                                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-teal-700"
                                                style={{ width: `${progress}%` }}
                                                title={`${progress}%`}
                                            />
                                        </div>
                                    </div>

                                    {/* stats */}
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="rounded-lg border p-2">
                                            <div className="text-black/60">
                                                {t("home.units", "Բնակարաններ")}
                                            </div>
                                            <div className="font-semibold">{p.units}</div>
                                        </div>
                                        <div className="rounded-lg border p-2">
                                            <div className="text-black/60">
                                                {t("home.area", "Քմ միջակայք")}
                                            </div>
                                            <div className="font-semibold">
                                                {p.areaMin}–{p.areaMax} {t("home.sqm", "քմ")}
                                            </div>
                                        </div>
                                        <div className="rounded-lg border p-2">
                                            <div className="text-black/60">
                                                {t("home.parking", "Ավտոկայանատեղի")}
                                            </div>
                                            <div className="font-semibold">{p.parking}</div>
                                        </div>
                                    </div>

                                    {/* actions */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            onClick={() => openGallery(idx)}
                                            className="px-4 py-2 text-sm rounded-xl border hover:bg-slate-50"
                                        >
                                            {t("home.gallery", "Սլայդշոու")}
                                        </button>
                                        <button
                                            onClick={() => onBook?.(p)}
                                            className="px-5 py-2.5 text-sm rounded-xl bg-green-900 text-white hover:bg-green-800"
                                        >
                                            {t("seeDetails", "Ամրագրել")}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* modal */}
            {open && (
                <GalleryModal
                    images={projects[activeIdx].images}
                    index={slideIdx}
                    onClose={() => setOpen(false)}
                    onPrev={goPrev}
                    onNext={goNext}
                />
            )}
            {mapOpen && (
                <MapModal
                    title={projects[mapIdx].name}
                    address={projects[mapIdx].address}
                    lang={i18n.language === "ru" ? "ru" : i18n.language === "hy" ? "hy" : "en"}
                    onClose={() => setMapOpen(false)}
                />
            )}
        </>
    );
}
