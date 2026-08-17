// src/pages/Townhouses.tsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ReserveModal from "../components/ReserveModal";
import { postWithCsrf } from "../lib/api";
import { sendBitrixReserve } from "../lib/bitrix";
import GalleryModal from "../components/GalleryModal";
import { createPortal } from "react-dom";

/* ---------- Types ---------- */
type Status = "active" | "reserved" | "sold";

type House = {
    id: number;
    address: string;
    status: Status;
    terrace_size: number;
    plot_size: number;
    square_meter: number;
    images: string[];
    model_images?: string[];
    price?: number;
    discount_price?: number | null;
    discount?: number;
    reservedByMe?: boolean;
};

type Filters = {
    q?: string;
    priceFrom?: number | null;
    priceTo?: number | null;
    bedrooms?: number | null;
    status?: Array<"active" | "reserved" | "sold">;
    squareFrom?: number | null;
    plotFrom?: number | null;
    terraceFrom?: number | null;
    sort?: "price_asc" | "price_desc" | "size_desc" | "size_asc";
};

export default function TownhousesPage() {
    const { t, i18n } = useTranslation();
    const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");

    /* ---------- Filter ---------- */
    const [availableOnly, setAvailableOnly] = useState(true);

    /* ---------- Data ---------- */
    const [houses, setHouses] = useState<House[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({ status: ["active"], sort: "price_desc" });

    const applyFilter = (patch: Partial<Filters>) =>
        setFilters((f) => ({ ...f, ...patch }));

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        axios
            .get(`${API_BASE}/houses`, {
                signal: controller.signal,
                headers: { Accept: "application/json" },
                params: {
                    lang: i18n.language,
                    available: availableOnly ? 1 : 0,
                    price_from: filters.priceFrom ?? null,
                    price_to: filters.priceTo ?? null,
                    square_from: filters.squareFrom ?? null,
                    terrace_from: filters.terraceFrom ?? null,
                    sort: filters.sort ?? null,
                },
            })
            .then((res) => {
                const rows = (res.data?.data ?? res.data ?? []) as House[];
                setHouses(Array.isArray(rows) ? rows.map((h) => ({ ...h, reservedByMe: false })) : []);
            })
            .catch((err: any) => {
                if (axios.isCancel?.(err) || err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
                setError(err?.message ?? "Error");
                setHouses([]);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [
        API_BASE,
        i18n.language,
        availableOnly,
        filters.priceFrom,
        filters.priceTo,
        filters.sort,
        filters.squareFrom,
        filters.terraceFrom,
    ]);

    /* ---------- Hero slides (optional) ---------- */
    const [slides, setSlides] = useState<string[]>([]);
    const [slideIdx, setSlideIdx] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        axios
            .get(`${API_BASE}/houses/townhouses/slides`, {
                signal: controller.signal,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                const arr = (res.data?.data ?? res.data ?? []) as any[];
                const urls = arr
                    .map((s) => (typeof s === "string" ? s : s?.url || s?.image || s?.src))
                    .filter(Boolean) as string[];
                setSlides(urls);
            })
            .catch(() => setSlides([]));
        return () => controller.abort();
    }, [API_BASE, i18n.language]);
    useEffect(() => {
        if (slides.length <= 1) return;
        const id = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 4500);
        return () => clearInterval(id);
    }, [slides]);

    /* ---------- Drawer (details) ---------- */
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [details, setDetails] = useState<{
        id: number;
        images: string[];
        status: Status;
        discount?: number;
        area: number;
        terrace: number;
        price?: number | null;
        discountPrice?: number | null;
        address?: string;
    } | null>(null);

    /* ---------- Reserve modal ---------- */
    const [reserveFor, setReserveFor] = useState<{ id: number; square_meter: number } | null>(null);
    const [reserveSuccess, setReserveSuccess] = useState<{ name: string; phone: string } | null>(null);

    const isFilterDirty = Boolean(
        filters.q ||
        filters.priceFrom != null ||
        filters.priceTo != null ||
        filters.bedrooms != null ||
        filters.squareFrom != null ||
        filters.plotFrom != null ||
        filters.terraceFrom != null ||
        (filters.status && (filters.status.length !== 1 || filters.status[0] !== "active")) ||
        (filters.sort && filters.sort !== "price_desc") ||
        !availableOnly
    );

    return (
        <>
            {/* Full-bleed hero */}
            <section className="relative left-1/2 -ml-[50vw] w-[100vw] mt-[-2rem] mb-8 h-[60svh] overflow-hidden rounded-b-3xl">
                {slides.length ? (
                    slides.map((src, i) => (
                        <img
                            key={src + i}
                            src={src}
                            alt=""
                            loading={i === 0 ? "eager" : "lazy"}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                i === slideIdx ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
                {!!slides.length && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setSlideIdx(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`w-2.5 h-2.5 rounded-full transition ${
                                    i === slideIdx ? "bg-white" : "bg-white/50 hover:bg-white/70"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Controls — mobile quick filter (kept minimal) */}
            <div className="lg:hidden mb-4 flex items-center gap-2">
                {isFilterDirty && (
                    <button
                        className="ml-auto rounded-xl bg-white border px-3 py-2 text-sm"
                        onClick={() => {
                            setFilters({ status: ["active"], sort: "price_desc" });
                            setAvailableOnly(true);
                        }}
                    >
                        {t("filters.reset", "Մաքրել")}
                    </button>
                )}
                <button
                    className="rounded-xl border bg-white px-3 py-2 text-sm"
                    onClick={() => setAvailableOnly((v) => !v)}
                >
                    {availableOnly
                        ? t("booking.filters.available.on", "Առկա")
                        : t("booking.filters.available.off", "Պահված + Վաճառված")}
                </button>
            </div>

            {/* CONTENT: Filter (left) + List (right) */}
            <div className="grid lg:grid-cols-12 gap-6">
                {/* Sidebar (shortened) */}
                <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
                    <div className="sticky top-6 rounded-2xl border bg-white/80 backdrop-blur p-5 shadow space-y-4">
                        <h3 className="text-lg font-semibold">{t("filters.title", "Ֆիլտր")}</h3>

                        {/* Price */}
                        <div className="grid grid-cols-1 gap-3">
                            <label className="text-sm">
                                <span className="block mb-1">{t("filters.price_from", "Գին՝ սկիզբ")}</span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.priceFrom ?? ""}
                                    onChange={(e) => applyFilter({ priceFrom: e.target.value ? Number(e.target.value) : null })}
                                />
                            </label>
                            <label className="text-sm">
                                <span className="block mb-1">{t("filters.price_to", "Գին՝ վերջ")}</span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.priceTo ?? ""}
                                    onChange={(e) => applyFilter({ priceTo: e.target.value ? Number(e.target.value) : null })}
                                />
                            </label>
                        </div>

                        {/* Available toggle */}
                        <button
                            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                                availableOnly ? "bg-green-900 text-white border-green-900" : "bg-white hover:bg-green-50"
                            }`}
                            onClick={() => setAvailableOnly((v) => !v)}
                        >
                            {availableOnly
                                ? t("booking.filters.available.on", "Առկա")
                                : t("booking.filters.available.off", "Պահված + Վաճառված")}
                        </button>

                        {/* Sizes */}
                        <div className="grid grid-cols-2 gap-3">
                            <label className="text-sm">
                                <span className="block mb-1">{t("filters.square_from", "Մակերես ≥")}</span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.squareFrom ?? ""}
                                    onChange={(e) => applyFilter({ squareFrom: e.target.value ? Number(e.target.value) : null })}
                                />
                            </label>
                            <label className="text-sm">
                                <span className="block mb-1">{t("filters.terrace_from", "տերասսա ≥")}</span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.terraceFrom ?? ""}
                                    onChange={(e) => applyFilter({ terraceFrom: e.target.value ? Number(e.target.value) : null })}
                                />
                            </label>
                        </div>

                        {/* Reset */}
                        {isFilterDirty && (
                            <button
                                className="w-full rounded-xl border-2 border-gray-300 py-2 hover:bg-gray-50"
                                onClick={() => {
                                    setFilters({ status: ["active"], sort: "price_desc" });
                                    setAvailableOnly(true);
                                }}
                            >
                                {t("filters.reset")}
                            </button>
                        )}
                    </div>
                </aside>

                {/* List */}
                <section className="lg:col-span-8 xl:col-span-9">
                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
                        {houses.map((h) => (
                            <HouseCard
                                key={h.id}
                                data={h}
                                onView={() => {
                                    setDetails({
                                        id: h.id,
                                        images: Array.isArray(h.images) ? h.images : [],
                                        status: h.status,
                                        discount: h.discount,
                                        area: h.square_meter,
                                        terrace: h.terrace_size ?? 0,
                                        price: h.price ?? null,
                                        discountPrice: h.discount_price ?? null,
                                        address: h.address,
                                    });
                                    setDetailsOpen(true);
                                }}
                            />
                        ))}
                    </div>

                    {loading && <div className="py-8 text-center text-gray-500">{t("list.loading", "Բեռնում...")}</div>}
                    {!loading && houses.length === 0 && (
                        <div className="py-12 text-center text-gray-500">{t("list.empty", "Չկան արդյունքներ")}</div>
                    )}
                </section>
            </div>

            {/* Drawer */}
            {detailsOpen && details && (
                <HouseDetailsDrawer
                    open={detailsOpen}
                    onClose={() => setDetailsOpen(false)}
                    data={details}
                    onReserve={() => {
                        setDetailsOpen(false);
                        setReserveFor({ id: details.id, square_meter: details.area });
                    }}
                />
            )}

            {/* Reserve modal */}
            {reserveFor && (
                <ReserveModal
                    kind="houses"
                    unit={{ id: reserveFor.id, square_meter: reserveFor.square_meter, floor_level: 0 }}
                    onClose={() => setReserveFor(null)}
                    onSubmit={async (payload, type) => {
                        try {
                            await postWithCsrf("/reserve/houses", {
                                relation_id: reserveFor.id,
                                name: payload.name,
                                phone: payload.phone,
                                lang: i18n.language,
                                type
                            });
                            try {
                                await sendBitrixReserve({
                                    kind: "houses",
                                    relationId: reserveFor.id,
                                    name: payload.name,
                                    phone: payload.phone,
                                    locale: i18n.language,
                                    requestType: type,
                                });
                            } catch (error) {
                                console.error("Bitrix send failed:", error);
                            }

                            setHouses((prev) =>
                                prev.map((h) =>
                                    h.id === reserveFor.id
                                        ? { ...h, reservedByMe: true, status: h.status === "active" ? "reserved" : h.status }
                                        : h
                                )
                            );
                        } finally {
                            setReserveSuccess({ name: payload.name, phone: payload.phone });
                            setReserveFor(null);
                        }
                    }}
                />
            )}
            {reserveSuccess && (
                <SuccessModal
                    message={t("booking.reserveSent", { name: reserveSuccess.name, phone: reserveSuccess.phone })}
                    onClose={() => setReserveSuccess(null)}
                />
            )}
        </>
    );
}
function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border px-3 py-2">
            <div className="text-[11px] text-black/60">{label}</div>
            <div className="font-semibold">{value}</div>
        </div>
    );
}
/* ---------- Card (styled like Apartments) ---------- */
function HouseCard({ data, onView }: { data: House; onView: () => void }) {
    const { t } = useTranslation();
    const main = data.images?.[0];

    const priceBlock =
        typeof data.discount_price === "number" &&
        typeof data.price === "number" &&
        data.discount_price !== data.price ? (
            <div className="font-semibold flex flex-col">
        <span className="line-through text-black/40 mr-2">
          {data.price.toLocaleString()} {t("units.amd", "AMD")}
        </span>
                <span className="text-emerald-700 font-bold">
          {data.discount_price.toLocaleString()} {t("units.amd", "AMD")}
        </span>
            </div>
        ) : (
            <div className="font-semibold">
                {typeof data.price === "number"
                    ? `${data.price.toLocaleString()} ${t("units.amd", "AMD")}`
                    : t("booking.price.soon")}
            </div>
        );

    return (
        <article className="relative overflow-hidden rounded-2xl border bg-white shadow">
            <div className="flex flex-col h-full justify-between">
                <div className="relative h-48 bg-white">
                    {main ? (
                        <img src={main} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <div className="absolute inset-0 grid place-items-center text-slate-400">—</div>
                    )}

                    {/* discount */}
                    {data.discount && data.discount > 0 && (
                        <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 text-xs font-medium">
            {t("discount", "Զեղչ")} {data.discount}%
          </span>
                    )}

                    {/* status */}
                    <span
                        className={`absolute top-3 right-3 text-xs text-white px-2.5 py-1 rounded-full ${
                            data.status === "active" ? "bg-emerald-600" : data.status === "reserved" ? "bg-amber-500" : "bg-rose-600"
                        }`}
                    >
          {t(`booking.status.${data.status}`)}
        </span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="col-span-2 text-xs text-slate-500">{data.address}</div>
                    <div className="col-span-2 rounded-xl border px-3 py-2">
                        <div className="text-[11px] text-black/60">{t("booking.card.price")}</div>
                        {priceBlock}
                    </div>
                    <Info label={t("booking.card.area")} value={`${data.square_meter} ${t("booking.card.sqm")}`} />
                    <Info label={t("townhouse.card.terrace", "տերասսա")} value={`${data.terrace_size ?? 0} ${t("booking.card.sqm")}`} />

                </div>

                <div className="px-4 pb-4">
                    <button
                        className="w-full rounded-xl px-4 py-2 text-sm bg-green-900 text-white hover:bg-green-800"
                        onClick={onView}
                    >
                        {t("common.viewMore", "Տեսնել ավելին")}
                    </button>
                </div>
            </div>

        </article>
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

/* ---------- Drawer component ---------- */
function HouseDetailsDrawer({
                                open,
                                onClose,
                                data,
                                onReserve,
                            }: {
    open: boolean;
    onClose: () => void;
    data: {
        id: number;
        images: string[];
        status: Status;
        discount?: number;
        area: number;
        terrace: number;
        price?: number | null;
        discountPrice?: number | null;
        address?: string;
    };
    onReserve: () => void;
}) {
    const { t } = useTranslation();

    // body lock
    useEffect(() => {
        if (!open) return;
        const y = window.scrollY;
        const prev = {
            overflow: document.body.style.overflow,
            pos: document.body.style.position,
            top: document.body.style.top,
            width: document.body.style.width,
        };
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${y}px`;
        document.body.style.width = "100%";
        return () => {
            document.body.style.overflow = prev.overflow;
            document.body.style.position = prev.pos;
            document.body.style.top = prev.top;
            document.body.style.width = prev.width;
            window.scrollTo(0, y);
        };
    }, [open]);

    const [enter, setEnter] = useState(false);
    useEffect(() => {
        if (!open) return;
        const id = requestAnimationFrame(() => setEnter(true));
        return () => cancelAnimationFrame(id);
    }, [open]);

    const [idx, setIdx] = useState(0);
    const [lb, setLb] = useState<{ images: string[]; index: number } | null>(null);
    useEffect(() => setIdx(0), [data.images.join("|")]);

    if (!open) return null;

    const priceBlock =
        typeof data.discountPrice === "number" &&
        typeof data.price === "number" &&
        data.discountPrice !== data.price ? (
            <div className="font-semibold flex flex-col">
        <span className="line-through text-black/40 mr-2">
          {data.price.toLocaleString()} {t("units.amd", "AMD")}
        </span>
                <span className="text-emerald-700 font-bold">
          {data.discountPrice.toLocaleString()} {t("units.amd", "AMD")}
        </span>
            </div>
        ) : (
            <div className="font-semibold">
                {typeof data.price === "number"
                    ? `${data.price.toLocaleString()} ${t("units.amd", "AMD")}`
                    : t("booking.price.soon")}
            </div>
        );

    const panel = (
        <>
            <div
                className={`fixed inset-0 z-[500] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
                    enter ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />
            <aside
                className={`fixed right-0 top-0 z-[510] h-full w-full max-w-[620px] bg-white shadow-2xl border-l transform transition-transform duration-300 ${
                    enter ? "translate-x-0" : "translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 py-3 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("common.details", "Մանրամասներ")}</h3>
                    <button className="rounded-full px-2.5 py-1 text-sm hover:bg-slate-100" onClick={onClose}>
                        {t("common.close", "Փակել")}
                    </button>
                </div>

                <div className="h-[calc(100%-56px)] overflow-y-auto p-4 space-y-4">
                    {/* Gallery */}
                    <div className="relative rounded-xl border overflow-hidden bg-slate-50">
                        {data.discount && data.discount > 0 && (
                            <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 text-xs font-medium">
                {t("discount", "Զեղչ")} {data.discount}%
              </span>
                        )}
                        <img
                            src={data.images[idx]}
                            alt=""
                            className="w-full h-72 object-contain bg-white cursor-zoom-in"
                            onClick={() => setLb({ images: data.images, index: idx })}
                        />
                        {data.images.length > 1 && (
                            <div className="flex gap-2 p-2 overflow-x-auto">
                                {data.images.map((src, i) => (
                                    <button
                                        key={i}
                                        className={`h-16 w-24 flex-none rounded border bg-white overflow-hidden hover:ring-2 hover:ring-slate-400 ${
                                            i === idx ? "ring-2 ring-slate-500" : ""
                                        }`}
                                        onClick={() => setIdx(i)}
                                        onDoubleClick={() => setLb({ images: data.images, index: i })}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Facts */}
                    <div className="grid grid-cols-2 gap-3">
                        <Fact label={t("booking.card.area")} value={`${data.area} ${t("booking.card.sqm")}`} />
                        <Fact label={t("townhouse.card.terrace", "տերասսա")} value={`${data.terrace} ${t("booking.card.sqm")}`} />
                        <div className="col-span-2 rounded-xl border px-3 py-2">
                            <div className="text-[11px] text-black/60">{t("booking.card.price")}</div>
                            {priceBlock}
                        </div>
                        <Fact
                            label={t("booking.status.title", "Կարգավիճակ")}
                            value={
                                data.status === "active"
                                    ? t("booking.status.active")
                                    : data.status === "reserved"
                                        ? t("booking.status.reserved")
                                        : t("booking.status.sold")
                            }
                        />
                        {data.address && <Fact label={t("address", "Հասցե")} value={data.address} />}
                    </div>

                    <div className="pt-2">
                        <button
                            className="w-full rounded-xl bg-green-900 text-white px-4 py-2 text-sm hover:bg-green-800"
                            onClick={onReserve}
                        >
                            {t("booking.reserve", "Ամրագրել")}
                        </button>
                    </div>
                </div>
            </aside>

            {lb && (
                <GalleryModal
                    images={lb.images}
                    index={lb.index}
                    onClose={() => setLb(null)}
                    onPrev={() => {}}
                    onNext={() => {}}
                />
            )}
        </>
    );

    return createPortal(panel, document.body);
}

/* ---------- Success modal (shared) ---------- */
function SuccessModal({ message, onClose }: { message: string; onClose: () => void }) {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm grid place-items-center">
            <div className="bg-white rounded-2xl p-6 w-[min(90vw,480px)] shadow-xl text-center">
                <div className="mx-auto mb-3 w-12 h-12 grid place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t("common.success", "Հաջողվեց")}</h3>
                <p className="text-sm text-slate-600">{message}</p>
                <button
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
                    onClick={onClose}
                >
                    {t("common.close", "Փակել")}
                </button>
            </div>
        </div>
    );
}
