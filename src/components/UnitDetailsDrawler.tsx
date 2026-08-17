// src/components/ApartmentsCarousel.tsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ReserveModal from "./../components/ReserveModal";
import { postWithCsrf } from "../lib/api";
import { sendBitrixReserve } from "../lib/bitrix";
import GalleryModal from "../components/GalleryModal";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

type Status = "active" | "reserved" | "sold";
type Apartment = {
    id: number;
    number?: string | number | null;
    building?: string | null;
    block?: string | null;
    floor_level: number;
    square_meter: number;
    price: number | null;
    image?: string;         // unit overlay (transparent PNG/SVG)
    parent_image?: string;  // floor plan / parent
    status: Status;
    discount?: number;
};

export default function ApartmentsCarousel() {
    const { t, i18n } = useTranslation();
    const API = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");
    const navigate = useNavigate();

    const [items, setItems] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reserve flow
    const [reserveFor, setReserveFor] = useState<{ id: number; number?: string | number | null; building?: string | null; block?: string | null; floor_level?: number; rooms?: number | null; sqm: number } | null>(null);

    // Image preview (lightbox for card cover)
    const [preview, setPreview] = useState<string[] | null>(null);

    // Details drawer state
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [details, setDetails] = useState<{
        id: number;
        number?: string | number | null;
        building?: string | null;
        block?: string | null;
        images: string[];
        roomsLabel: string;
        areaLabel: string;
        floorLabel: string;
        priceLabel: string;
        status: Status;
        discount?: number;
    } | null>(null);

    // Success + garage upsell states
    const [reserveSuccess, setReserveSuccess] = useState<{ name: string; phone: string } | null>(null);
    const [garageOffer, setGarageOffer] = useState<{
        request_id: number | string;
        session: string;
        name: string;
        phone: string;
    } | null>(null);
    const [garageBusy, setGarageBusy] = useState(false);

    const buildApartmentSummary = (unit: {
        id: number;
        number?: string | number | null;
        building?: string | null;
        block?: string | null;
        floor_level?: number;
        sqm?: number;
        rooms?: number | null;
    }) =>
        [
            unit.building ? `${unit.building}` : null,
            unit.block ? `Մուտք ${unit.block}` : null,
            `Բնակարան #${unit.number ?? unit.id}`,
            unit.floor_level != null ? `${unit.floor_level} հարկ` : null,
            unit.sqm != null ? `${unit.sqm} ք.մ.` : null,
            unit.rooms != null ? `${unit.rooms} սենյակ` : null,
        ]
            .filter(Boolean)
            .join(", ");

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        axios
            .get(`${API}/apartments/featured`, {
                signal: controller.signal,
                headers: { Accept: "application/json" },
                params: { lang: i18n.language },
            })
            .then((res) => {
                const rows = (res.data?.data ?? res.data ?? []) as Apartment[];
                setItems(Array.isArray(rows) ? rows : []);
            })
            .catch((err: any) => {
                if (axios.isCancel?.(err) || err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
                setError(err?.message ?? "Error");
                setItems([]);
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, [i18n.language]);

    const trackRef = useRef<HTMLDivElement | null>(null);
    const scrollByCards = (n: number) => {
        const el = trackRef.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 320;
        el.scrollBy({ left: n * (card + 16), behavior: "smooth" });
    };

    // open details drawer with full info
    const openDetails = (ap: Apartment) => {
        const imgs = [ap.parent_image, ap.image].filter(Boolean) as string[];
        setDetails({
            id: ap.id,
            number: ap.number,
            building: ap.building ?? null,
            block: ap.block ?? null,
            images: imgs.length ? imgs : [],
            roomsLabel: t("reserve.floorN", { n: ap.floor_level }),
            areaLabel: `${ap.square_meter} ${t("booking.card.sqm")}`,
            floorLabel: t("reserve.floorN", { n: ap.floor_level }),
            priceLabel:
                typeof ap.price === "number"
                    ? `${ap.price.toLocaleString()} ${t("units.amd", "AMD")}`
                    : t("booking.price.soon"),
            status: ap.status,
            discount: ap.discount,
        });
        setDetailsOpen(true);
    };

    return (
        <section className="my-10">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{t("home.units", "Բնակարաններ")}</h3>
                <div className="flex gap-2">
                    <button className="rounded-full border px-3 py-1 text-sm" onClick={() => scrollByCards(-1)}>‹</button>
                    <button className="rounded-full border px-3 py-1 text-sm" onClick={() => scrollByCards(1)}>›</button>
                </div>
            </div>

            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ scrollbarWidth: "none" }}
            >
                {/* hide scrollbar in WebKit */}
                <style>{`.snap-x::-webkit-scrollbar{display:none}`}</style>

                {loading && <div className="text-sm text-green-600">{t("common.loading", "Բեռնվում է…")}</div>}
                {error && <div className="text-sm text-red-600">{error}</div>}

                {items.map((ap) => (
                    <article
                        key={ap.id}
                        data-card
                        className="snap-start min-w-[320px] sm:min-w-[360px] max-w-[380px] relative overflow-hidden rounded-2xl border bg-white shadow"
                    >
                        <div
                            className="relative h-44 bg-white cursor-zoom-in"
                            onClick={() => setPreview([ap.parent_image, ap.image].filter(Boolean) as string[])}
                        >
                            {ap.parent_image && (
                                <img src={ap.parent_image} alt="" className="absolute inset-0 w-full h-full object-contain" />
                            )}
                            {ap.image && <img src={ap.image} alt="" className="absolute inset-0 w-full h-full object-contain" />}
                            {!ap.parent_image && !ap.image && (
                                <div className="absolute inset-0 grid place-items-center text-slate-400">—</div>
                            )}

                            {/* discount */}
                            {ap.discount && ap.discount > 0 && (
                                <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 text-xs font-medium">
                  {t("discount", "Զեղչ")} {ap.discount}%
                </span>
                            )}

                            {/* status */}
                            <span
                                className={`absolute top-3 right-3 text-xs text-white px-2.5 py-1 rounded-full ${
                                    ap.status === "active" ? "bg-emerald-600" : ap.status === "reserved" ? "bg-amber-500" : "bg-rose-600"
                                }`}
                            >
                {t(`booking.status.${ap.status}`)}
              </span>
                        </div>

                        <div className="p-4 grid grid-cols-3 gap-3 text-sm">
                            <Info label={t("booking.card.floor")} value={t("reserve.floorN", { n: ap.floor_level })} />
                            <Info label={t("booking.card.area")} value={`${ap.square_meter} ${t("booking.card.sqm")}`} />
                            <Info
                                label={t("booking.card.price")}
                                value={
                                    typeof ap.price === "number"
                                        ? `${ap.price.toLocaleString()} ${t("units.amd", "AMD")}`
                                        : t("booking.price.soon")
                                }
                            />
                        </div>

                        <div className="px-4 pb-4">
                            <button
                                className="w-full rounded-xl px-4 py-2 text-sm bg-green-900 text-white hover:bg-green-800"
                                onClick={() => openDetails(ap)}
                            >
                                {t("common.viewMore", "Տեսնել ավելին")}
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <button
                className="group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 bg-white text-sm font-medium text-gray-900 hover:bg-slate-50 active:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                onClick={() => navigate("/apartments")}
            >
                <span>{t("common.viewMore", "Տեսնել ավելին")}</span>
                <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-active:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Reserve modal */}
            {reserveFor && (
                <ReserveModal
                    kind="apartments"
                    unit={{ id: reserveFor.id, number: String(reserveFor.number ?? reserveFor.id), square_meter: reserveFor.sqm, floor_level: reserveFor.floor_level ?? 0 }}
                    onClose={() => setReserveFor(null)}
                    onSubmit={async (payload) => {
                        try {
                            const res = await postWithCsrf("/reserve/apartments", {
                                relation_id: reserveFor.id,
                                name: payload.name,
                                phone: payload.phone,
                                lang: i18n.language,
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
                                        squareMeter: reserveFor.sqm ?? '',
                                });
                            } catch (error) {
                                console.error("Bitrix send failed:", error);
                            }

                            const data = (res?.data?.data ?? res) as {
                                garage_availability?: boolean;
                                request_id?: number | string;
                                session?: string;
                            };

                            if (data?.garage_availability) {
                                setGarageOffer({
                                    request_id: data.request_id!,
                                    session: data.session!,
                                    name: payload.name,
                                    phone: payload.phone!,
                                });
                            } else {
                                setReserveSuccess({ name: payload.name, phone: payload.phone! });
                            }
                        } finally {
                            setReserveFor(null);
                        }
                    }}
                />
            )}

            {/* Lightbox for card cover */}
            {preview && (
                <GalleryModal images={preview} index={0} onClose={() => setPreview(null)} onPrev={() => {}} onNext={() => {}} />
            )}

            {/* Details drawer */}
            {detailsOpen && details && (
                <UnitDetailsDrawer
                    open={detailsOpen}
                    onClose={() => setDetailsOpen(false)}
                    images={details.images}
                    status={details.status}
                    discount={details.discount}
                    floorLabel={details.floorLabel}
                    areaLabel={details.areaLabel}
                    priceLabel={details.priceLabel}
                    onReserve={() => {
                        setDetailsOpen(false);
                        setReserveFor({
                            id: details.id,
                            number: details.number,
                            building: details.building,
                            block: details.block,
                            floor_level: Number((details.floorLabel.match(/\d+/)?.[0] ?? 0)),
                            sqm: Number(details.areaLabel.split(" ")[0]) || 0,
                        });
                    }}
                />
            )}

            {/* Garage upsell */}
            {garageOffer && (
                <GarageOfferModal
                    loading={garageBusy}
                    onConfirm={async () => {
                        try {
                            setGarageBusy(true);
                            await postWithCsrf(`/reserve/${garageOffer.request_id}/want_garage`, { session: garageOffer.session });
                        } catch (e) {
                            console.error("Garage confirm failed:", e);
                        } finally {
                            setGarageBusy(false);
                            setReserveSuccess({ name: garageOffer.name, phone: garageOffer.phone });
                            setGarageOffer(null);
                        }
                    }}
                    onSkip={() => {
                        setReserveSuccess({ name: garageOffer.name, phone: garageOffer.phone });
                        setGarageOffer(null);
                    }}
                    onClose={() => {
                        setReserveSuccess({ name: garageOffer.name, phone: garageOffer.phone });
                        setGarageOffer(null);
                    }}
                />
            )}

            {/* Success */}
            {reserveSuccess && (
                <SuccessModal
                    message={t("booking.reserveSent", { name: reserveSuccess.name, phone: reserveSuccess.phone })}
                    onClose={() => setReserveSuccess(null)}
                />
            )}
        </section>
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

/* -------------------- UnitDetailsDrawer (inline component) -------------------- */

function UnitDetailsDrawer({
                               open,
                               onClose,
                               images,
                               status,
                               discount,
                               floorLabel,
                               areaLabel,
                               priceLabel,
                               onReserve,
                           }: {
    open: boolean;
    onClose: () => void;
    images: string[];
    status: Status;
    discount?: number;
    floorLabel: string;
    areaLabel: string;
    priceLabel: string;
    onReserve: () => void;
}) {
    const { t } = useTranslation();

    // body scroll lock
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

    // current main image + lightbox
    const [current, setCurrent] = useState(0);
    const [lb, setLb] = useState<{ images: string[]; index: number } | null>(null);

    useEffect(() => {
        // reset when opening / images change
        setCurrent(0);
    }, [images.join("|")]);

    if (!open) return null;

    const content = (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[500] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
                    enter ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />
            {/* Panel */}
            <aside
                className={`fixed right-0 top-0 z-[510] h-full w-full max-w-[560px] bg-white shadow-2xl border-l
                    transform transition-transform duration-300 ${enter ? "translate-x-0" : "translate-x-full"}`}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 py-3 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{t("common.details", "Մանրամասներ")}</h3>
                    <button className="rounded-full px-2.5 py-1 text-sm hover:bg-slate-100" onClick={onClose}>
                        {t("common.close", "Փակել")}
                    </button>
                </div>

                {/* Body */}
                <div className="h-[calc(100%-56px)] overflow-y-auto p-4 space-y-4">
                    {/* Gallery */}
                    <div className="relative rounded-xl border overflow-hidden bg-slate-50">
                        {/* discount badge */}
                        {discount && discount > 0 && (
                            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 px-3 py-1 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 text-xs font-medium">
                {t("discount", "Զեղչ")} {discount}%
              </span>
                        )}

                        {/* main image (click to open lightbox) */}
                        <img
                            src={images[current]}
                            alt=""
                            className="w-full h-64 object-contain bg-white cursor-zoom-in"
                            onClick={() => setLb({ images, index: current })}
                            onError={(e) => ((e.currentTarget.style.visibility = "hidden"))}
                        />

                        {/* thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 p-2 overflow-x-auto">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        className={`h-14 w-20 flex-none rounded border bg-white overflow-hidden hover:ring-2 hover:ring-slate-400 ${
                                            i === current ? "ring-2 ring-slate-500" : ""
                                        }`}
                                        onClick={() => setCurrent(i)}
                                        onDoubleClick={() => setLb({ images, index: i })}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Facts */}
                    <div className="grid grid-cols-2 gap-3">
                        <Fact label={t("booking.card.floor")} value={floorLabel} />
                        <Fact label={t("booking.card.area")} value={areaLabel} />
                        <Fact label={t("booking.card.price")} value={priceLabel} />
                        <Fact
                            label={t("booking.status.title", "Կարգավիճակ")}
                            value={
                                status === "active"
                                    ? t("booking.status.active")
                                    : status === "reserved"
                                        ? t("booking.status.reserved")
                                        : t("booking.status.sold")
                            }
                        />
                    </div>

                    {/* CTA */}
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

            {/* Lightbox for drawer images */}
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

    return createPortal(content, document.body);
}

function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border px-3 py-2">
            <div className="text-[11px] text-black/60">{label}</div>
            <div className="font-semibold">{value}</div>
        </div>
    );
}

/* ---------- Small shared modals (identical to Apartments page) ---------- */

function GarageOfferModal({
                              onConfirm,
                              loading = false,
                              onSkip,
                              onClose,
                          }: {
    onConfirm: () => void;
    loading?: boolean;
    onSkip: () => void;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm grid place-items-center">
            <div className="bg-white rounded-2xl p-6 w-[min(90vw,520px)] shadow-xl">
                <div className="mx-auto mb-3 w-12 h-12 grid place-items-center rounded-full bg-amber-100 text-amber-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 5L5 19" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="7" cy="7" r="2" />
                        <circle cx="17" cy="17" r="2" />
                    </svg>
                </div>

                <h3 className="text-lg font-semibold text-center mb-2">
                    {t("garage.offer.title", "Ավելացնե՞լ ավտոկայանատեղի 20% զեղչով")}
                </h3>
                <p className="text-sm text-slate-600 text-center mb-5">
                    {t("garage.offer.text", "Մենք ունենք հասանելի ավտոկայանատեղիներ։ Կարող եք ամրագրել նաև ավտոտնակը՝ ստանալով 20% զեղչ։")}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-center">
                    <button className="flex-1 sm:flex-none rounded-xl border px-4 py-2" onClick={onSkip}>
                        {t("garage.offer.no", "Ոչ, շնորհակալ եմ")}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl px-4 py-2 text-white bg-green-900 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {loading && <Spinner className="w-4 h-4" />}
                        {t("garage.yes", "Այո, վերցնել")}
                    </button>
                </div>

                <button className="mt-4 w-full text-center text-xs text-black/60 hover:underline" onClick={onClose}>
                    {t("common.close", "Փակել")}
                </button>
            </div>
        </div>
    );
}

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
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-green-900 text-white px-4 py-2 text-sm hover:bg-green-800"
                    onClick={onClose}
                >
                    {t("common.close", "Փակել")}
                </button>
            </div>
        </div>
    );
}

function Spinner({ className = "" }: { className?: string }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}


