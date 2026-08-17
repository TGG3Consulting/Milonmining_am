// src/components/BookingDrawer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { FiX, FiFilter, FiLayout, FiLock, FiCheck, FiLoader } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import GalleryModal from "./GalleryModal";
import ReserveModal from "./ReserveModal";
import type { Project } from "./ProjectCarousel";
import {postWithCsrf} from "../lib/api";
import { sendBitrixReserve } from "../lib/bitrix";
import {toast} from "react-toastify";

type ApiUnit = {
    id: number | string;
    number?: string | number | null;
    building?: string | null;
    block?: string | null;
    rooms?: number | null;
    floor_level: number;
    square_meter: number;
    price: number | null;
    square_meter_price: string | null;
    image: string | null;
    parent_image: string | null;
    status: "active" | "reserved" | "sold";
};
type ApiEnvelope<T> = { ok: boolean; message: string; data: T };
type ApiPage<T> = {
    current_page: number;
    data: T[];
    next_page_url: string | null;
    last_page: number;
    per_page: number;
    total: number;
};

type DrawerUnit = ApiUnit & { mainImage: string | null; reservedByMe?: boolean };

const API_BASE = "https://api.milonmining.am"; // adjust if needed

export default function BookingDrawer({
                                          project,
                                          open = true,
                                          onClose,
                                      }: {
    project: Project & { floors_qty?: number };
    open?: boolean;
    onClose: () => void;
}) {
    const { t, i18n } = useTranslation();

    // tabs
    const [tab, setTab] = useState<"layout" | "filter">("filter");

    // filters
    const [available, setAvailable] = useState<boolean>(true); // default true
    const [rooms, setRooms] = useState<number | null>(null);
    const [duplex, setDuplex] = useState<boolean | null>(null);
    const [square, setSquare] = useState<number | "">("");
    const [squareDebounced, setSquareDebounced] = useState<number | null>(null);
    const [floorLevel, setFloorLevel] = useState<number | null>(null);

    useEffect(() => {
        const id = setTimeout(() => setSquareDebounced(square === "" ? null : Number(square)), 300);
        return () => clearTimeout(id);
    }, [square]);

    const [preview, setPreview] = useState<{ image: string | null; parent_image: string | null } | null>(null);
    const [reserveFor, setReserveFor] = useState<DrawerUnit | null>(null);

    const buildApartmentSummary = (unit: {
        id: number | string;
        number?: string | number | null;
        floor_level?: number;
        square_meter?: number;
        rooms?: number | null;
    }) =>
        [
            `#${unit.number ?? unit.id}`,
            unit.floor_level != null ? `${unit.floor_level} հարկ` : null,
            unit.square_meter != null ? `${unit.square_meter} ք.մ.` : null,
            unit.rooms != null ? `${unit.rooms} սենյակ` : null,
        ]
            .filter(Boolean)
            .join("\n");

    const buildApartmentSummaryDetailed = (unit: {
        id: number | string;
        number?: string | number | null;
        building?: string | null;
        block?: string | null;
        floor_level?: number;
        square_meter?: number;
        rooms?: number | null;
    }) =>
        [
            unit.building ? `${unit.building}` : null,
            unit.block ? `Mutq ${unit.block}` : null,
            `Bnakaran #${unit.number ?? unit.id}`,
            unit.floor_level != null ? `${unit.floor_level} hark` : null,
            unit.square_meter != null ? `${unit.square_meter} q.m.` : null,
            unit.rooms != null ? `${unit.rooms} senyak` : null,
        ]
            .filter(Boolean)
            .join(", ");

    // lock body scroll
    useEffect(() => {
        if (!open) return;
        const y = window.scrollY || window.pageYOffset;
        const prev = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            top: document.body.style.top,
            width: document.body.style.width,
        };
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${y}px`;
        document.body.style.width = "100%";
        return () => {
            document.body.style.overflow = prev.overflow;
            document.body.style.position = prev.position;
            document.body.style.top = prev.top;
            document.body.style.width = prev.width;
            window.scrollTo(0, y);
        };
    }, [open]);

    // enter/exit
    const [enter, setEnter] = useState(false);
    const [closing, setClosing] = useState(false);
    useEffect(() => {
        if (!open) return;
        const id = requestAnimationFrame(() => setEnter(true));
        return () => cancelAnimationFrame(id);
    }, [open]);
    const requestClose = () => {
        if (closing) return;
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 320);
    };

    // ---------- Fetching with infinite scroll ----------
    const [items, setItems] = useState<DrawerUnit[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const ctrlRef = useRef<AbortController | null>(null);

    const query = useMemo(() => {
        const p: Record<string, string> = {
            building_id: String(project.id),
            available: available ? "1" : "0",
        };
        if (rooms != null) p.rooms = String(rooms);
        if (duplex != null) p.duplex = duplex ? "1" : "0";
        if (squareDebounced != null) p.square_meter = String(squareDebounced);
        if (floorLevel != null) p.floor_level = String(floorLevel);
        return p;
    }, [project.id, available, rooms, duplex, squareDebounced, floorLevel]);

    // reset when filters or project change
    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(false);
    }, [project.id, query]);

    useEffect(() => {
        if (!open) return;
        fetchPage(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, project.id, query]);

    async function fetchPage(targetPage: number, append: boolean) {
        try {
            setLoading(true);
            setError(null);
            ctrlRef.current?.abort();
            ctrlRef.current = new AbortController();

            const usp = new URLSearchParams({ ...query, page: String(targetPage) });
            const r = await fetch(`${API_BASE}/apartments?${usp.toString()}`, {
                signal: ctrlRef.current.signal,
                // credentials: "include", // if using Sanctum
            });
            if (!r.ok) {
                const text = await r.text().catch(() => "");
                throw new Error(`${r.status} ${text}`);
            }
            const env: ApiEnvelope<ApiPage<ApiUnit>> = await r.json();
            const pageData = env.data;

            const mapped: DrawerUnit[] = pageData.data.map((a) => ({
                ...a,
                mainImage: a.image ?? a.parent_image ?? null,
                reservedByMe: false
            }));

            setItems((prev) => (append ? [...prev, ...mapped] : mapped));
            setPage(pageData.current_page);
            setHasMore(Boolean(pageData.next_page_url) && pageData.current_page < pageData.last_page);
        } catch (e: any) {
            if (e?.name !== "AbortError") setError(e?.message ?? "Error");
        } finally {
            setLoading(false);
        }
    }

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        if (!sentinelRef.current) return;
        const el = sentinelRef.current;
        const io = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                if (e.isIntersecting && hasMore && !loading) {
                    fetchPage(page + 1, true);
                }
            },
            { root: null, rootMargin: "400px 0px", threshold: 0 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [hasMore, loading, page]);

    // Floor options
    const floorOptions = useMemo(() => {
        const n = Number(project.floors_qty ?? 0);
        return Array.from({ length: Math.max(0, n) }, (_, i) => i + 1);
    }, [project.floors_qty]);

    const activeCount =
        (available ? 0 : 1) +
        (rooms != null ? 1 : 0) +
        (duplex != null ? 1 : 0) +
        (squareDebounced != null ? 1 : 0) +
        (floorLevel != null ? 1 : 0);
    const toStrings = (x: (string | null | undefined)[]): string[] =>
        x.filter((v): v is string => !!v);
    const resetFilters = () => {
        setAvailable(true);
        setRooms(null);
        setDuplex(null);
        setSquare("");
        setFloorLevel(null);
    };

    return (
        <>
        {/* Overlay */}
        <div
            className={`fixed inset-0 z-[250] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
                enter && !closing ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={requestClose}
        />

        {/* Drawer */}
        <aside
            className={`fixed right-0 top-0 z-[260] h-full w-full max-w-[560px] bg-white shadow-2xl border-l transform transition-transform duration-300 will-change-transform ${
                enter && !closing ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
        >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 py-3 border-b flex items-center justify-between">
                <div className="min-w-0 flex flex-col gap-y-2">
                    <div className="text-xs text-black/50 truncate">{project.address}</div>
                    <h3 className="text-lg font-semibold truncate">{project.name}</h3>
                </div>
                <button onClick={requestClose} className="rounded-full px-2.5 py-1 text-sm hover:bg-slate-100" aria-label={t("common.close")}>
                    <FiX size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 pb-6 overflow-y-auto h-[calc(100%-120px)]">
                {tab === "layout" && (
                    <div className="h-72 grid place-items-center rounded-xl border bg-slate-50 text-slate-500">
                        <span className="text-sm">{t("booking.layoutPlaceholder")}</span>
                    </div>
                )}

                {tab === "filter" && (
                    <div className="space-y-5">
                        {/* Filter bar */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Available toggle */}
                            <button
                                className={`px-3 py-1.5 rounded-lg border text-sm ${
                                    available ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"
                                }`}
                                onClick={() => setAvailable((v) => !v)}
                                title={t("booking.filters.available.title")}
                            >
                                {available ? t("booking.filters.available.on") : t("booking.filters.available.off")}
                            </button>

                            {/* Rooms */}
                            <div className="inline-flex gap-1">
                                {[1, 2, 3, 4].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRooms(rooms === r ? null : r)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm ${
                                            rooms === r ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"
                                        }`}
                                    >
                                        {t("booking.filters.rooms", { count: r })}
                                    </button>
                                ))}
                            </div>

                            {/* Duplex */}
                            <div className="inline-flex rounded-lg overflow-hidden border">
                                <Seg active={duplex === null} onClick={() => setDuplex(null)} label={t("booking.filters.duplex.any")} />
                                <Seg active={duplex === true} onClick={() => setDuplex(true)} label={t("booking.filters.duplex.yes")} />
                                <Seg active={duplex === false} onClick={() => setDuplex(false)} label={t("booking.filters.duplex.no")} />
                            </div>

                            {/* Square >= */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    value={square}
                                    onChange={(e) => setSquare(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-28 rounded-lg border px-3 py-1.5 text-sm"
                                    placeholder={t("booking.filters.squareGte")}
                                />
                            </div>

                            {/* Floor level */}
                            <select
                                value={floorLevel ?? ""}
                                onChange={(e) => setFloorLevel(e.target.value === "" ? null : Number(e.target.value))}
                                className="rounded-lg border px-3 py-1.5 text-sm"
                            >
                                <option value="">{t("booking.filters.allFloors")}</option>
                                {floorOptions.map((f) => (
                                    <option key={f} value={f}>
                                        {t("booking.filters.floor", { n: f })}
                                    </option>
                                ))}
                            </select>

                            {/* Reset */}
                            <button onClick={resetFilters} className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-50">
                                {t("booking.filters.reset")}
                            </button>
                        </div>

                        {/* Items */}
                        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                        <div className="space-y-3">
                            {items.map((u) => {
                                const isActive = u.status === "active" && !u.reservedByMe;
                                // mini gallery thumbs (image column) — left overlay
                                const thumbs = [u.image, u.parent_image].filter(Boolean) as string[];

                                return (
                                    <article key={u.id} className={`relative rounded-3xl border-2 bg-white overflow-hidden shadow-lg transition
    ${u.status === "active" ? "border-emerald-500" : "border-slate-200"}
    hover:shadow-xl hover:-translate-y-0.5`}>
                                        <div className="relative h-44 bg-slate-100">
                                            {u.mainImage ? (
                                                <img
                                                    src={u.mainImage}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onClick={() => setPreview({ image: u.image, parent_image: u.parent_image })}
                                                    style={{ cursor: "zoom-in" }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 grid place-items-center text-slate-500 text-sm">—</div>
                                            )}

                                            {/* Image column (thumbs) */}
                                            {thumbs.length > 0 && (
                                                <div className="absolute left-3 top-3 flex flex-col gap-2">
                                                    {thumbs.map((src) => (
                                                        <button
                                                            key={src}
                                                            onClick={() => {
                                                                setItems((prev) =>
                                                                    prev.map((it) => (it.id === u.id ? { ...it, mainImage: src } : it))
                                                                );
                                                            }}
                                                            className={`w-14 h-10 rounded-md border overflow-hidden bg-white/60 hover:bg-white`}
                                                            title={t("booking.preview")}
                                                        >
                                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 grid grid-cols-3 gap-3 text-sm">
                                            <Info label={t("booking.card.floor")} value={`${u.floor_level}`} />
                                            <Info label={t("booking.card.area")} value={`${u.square_meter} ${t("booking.card.sqm")}`} />
                                            <Info
                                                label={t("booking.card.price")}
                                                value={u.price ? `${formatAMD(u.price)} ֏` : t("booking.card.soon")}
                                            />
                                        </div>

                                        {/* Badges */}
                                        <div
                                            className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full text-white text-xs px-2 py-1 shadow ${
                                                u.reservedByMe ? "bg-emerald-700" : (u.status === "active" ? "bg-emerald-600" : "bg-slate-900")
                                            }`}
                                        >
                        {isActive ? <FiCheck /> : <FiLock />}
                        <span>
                          {u.reservedByMe
                              ? t("booking.status.reservedByMe", "Ամրագրել եք")
                              : u.status === "active"
                                  ? t("booking.status.active")
                                  : u.status === "reserved"
                                      ? t("booking.status.reserved")
                                      : t("booking.status.sold")}
                        </span>
                      </div>

                      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                        <button
                          className={`rounded-xl px-4 py-2 text-sm ${
                            isActive ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                          }`}
                          onClick={() => isActive && setReserveFor(u)}
                          disabled={!isActive}
                        >
                            {u.reservedByMe ? t("booking.status.reservedByMe", t("booking.already_reserve")) : t("booking.reserve")}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Infinite scroll sentinel + loader */}
              <div ref={sentinelRef} />
              {loading && (
                <div className="flex items-center justify-center gap-2 text-sm text-black/70 py-3">
                                        <FiLoader className="animate-spin" /> {t("common.loading")}
                                    </div>
                                )}
                                </div>
                                )}
                        </div>
                    </aside>

                {/* Image preview */}
                {preview &&
                    createPortal(
                        <GalleryModal
                            images={toStrings([preview.image, preview.parent_image])}
                            index={0} onClose={() => setPreview(null)} onPrev={() => {}} onNext={() => {}} />,
                        document.body
                    )}

                {/* Reserve modal */}
                {reserveFor &&
                    createPortal(
                        <ReserveModal
                            kind='apartments'
                            unit={{
                                id: Number(reserveFor.id),
                                square_meter: reserveFor.square_meter,
                                floor_level: reserveFor.floor_level,
                            }}
                            onClose={() => setReserveFor(null)}
                            onSubmit={async (payload) => {
                                try {
                                    await postWithCsrf("/reserve/apartments", {
                                        relation_id: reserveFor.id,
                                        name: payload.name,
                                        phone: payload.phone,
                                        lang: i18n.language
                                    });
                                    try {
                                        await sendBitrixReserve({
                                            kind: "apartments",
                                            relationId: reserveFor.id,
                                            name: payload.name,
                                            phone: payload.phone,
                                            locale: i18n.language,
                                            requestType: "reserve",
                                            unitSummary: buildApartmentSummary(reserveFor),
                                        apartmentNumber: reserveFor.number ?? reserveFor.id,
                                        floor: reserveFor.floor_level ?? '',
                                        squareMeter: reserveFor.square_meter ?? '',
                                        });
                                    } catch (error) {
                                        console.error("Bitrix send failed:", error);
                                    }

                                    toast.success(
                                        t("booking.reserveSent", { name: payload.name, phone: payload.phone })
                                    );
                                    setItems(prev =>
                                        prev.map(it =>
                                            it.id === reserveFor.id
                                                ? { ...it, reservedByMe: true, status: it.status === "active" ? "reserved" : it.status }
                                                : it
                                        )
                                    );
                                } catch (err: any) {
                                    console.error("Reserve request failed:", err);
                                    toast.error(t("reserve.errors.server", "Սերվերի սխալ, փորձեք կրկին"));
                                } finally {
                                    setReserveFor(null);
                                }
                            }}
                        />,
                        document.body
                    )}
            </>
            );
            }

            /* helpers */
            function TabBtn({
            active,
            onClick,
            icon,
            label,
        }: {
            active: boolean;
            onClick: () => void;
            icon: React.ReactNode;
            label: React.ReactNode;
        }) {
            return (
            <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm transition ${
                active ? "bg-slate-900 text-white" : "text-black/70 hover:bg-slate-50"
            }`}
        >
            {icon} <span>{label}</span>
        </button>
        );
        }

        function Seg({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
            return (
            <button className={`px-3 py-1.5 text-sm border-r last:border-r-0 ${active ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`} onClick={onClick}>
        {label}
        </button>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border px-3 py-2">
            <div className="text-[11px] text-black/60">{label}</div>
            <div className="font-semibold">{value}</div>
        </div>
    );
}

function formatAMD(x: number) {
    return new Intl.NumberFormat("hy-AM").format(x);
}


