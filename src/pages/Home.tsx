// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import usePageSEO from "../usePageSEO";
import BookingDrawer from "../components/BookingDrawer";
import ProjectCarousel, { Project } from "../components/ProjectCarousel";
import FeatureHighlights from "../components/FeautreHighlights";
import GalleryModal from "../components/GalleryModal";
import ReserveModal from "../components/ReserveModal";
import { FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { postWithCsrf } from "../lib/api";
import { sendBitrixReserve } from "../lib/bitrix";
import logoMilonUrl from "/logo_milon.png";
import ComingSoon from "../components/CommingSoon";
import ApartmentsCarousel from "../components/ApartmentCarousel";
import { useNavigate } from "react-router-dom";

// inside component
type Townhouse = {
    id: number;
    address: string;
    status: "active" | "reserved" | "sold";
    terrace_size: number;
    plot_size: number;
    square_meter: number;
    images: string[];
    model_images: string[];
    reservedByMe?: boolean;
};

export default function HomePage() {
    const { t, i18n } = useTranslation();

    // SEO (բրենդ + էջի անվանում)
    const seo = usePageSEO(`${t("brand")} - ${t("home.title")}`, t("home.desc"));
    const navigate = useNavigate();

    // ---- existing: buildings/projects ----
    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
        const controller = new AbortController();

        axios
            .get<Project[]>(`${import.meta.env.VITE_API_BASE ?? ""}/buildings`, {
                params: { lang: i18n.language },
                signal: controller.signal,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                const rows = Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? [];
                setProjects(rows as Project[]);
            })
            .catch((err: any) => {
                if (axios.isCancel?.(err) || err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
                console.error(err);
                setProjects([]);
            });

        return () => controller.abort();
    }, [i18n.language]);

    // Hard-fix title refresh race (եթե օգտագործում ես այս pattern-ը)
    useEffect(() => {
        document.title = `${t("brand")} - ${t("home.title")}`;
    }, [i18n.language, t]);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeProject, setActiveProject] = useState<Project | null>(null);

    // ---- NEW: tabs ----
    const [tab, setTab] = useState<"apartments" | "townhouses">("apartments");

    // ---- NEW: townhouses data ----
    const [houses, setHouses] = useState<Townhouse[]>([]);
    const [thLoading, setThLoading] = useState(false);
    const [thError, setThError] = useState<string | null>(null);
    const [available, setAvailable] = useState(true);
    // preview gallery for townhouses (images OR model_images)
    const [previewImages, setPreviewImages] = useState<string[] | null>(null);

    // reserve modal for townhouses
    const [reserveFor, setReserveFor] = useState<{ id: number; square_meter: number } | null>(null);

    // fetch townhouses when switching to that tab (first time)
    useEffect(() => {
        if (tab !== "townhouses" || houses.length) return;
        const controller = new AbortController();
        (async () => {
            try {
                setThLoading(true);
                setThError(null);
                const res = await axios.get(`${import.meta.env.VITE_API_BASE ?? ""}/houses`, {
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                    params: { lang: i18n.language, available: available ? 1 : 0, },

                });
                const rows = (res.data?.data ?? res.data ?? []) as Townhouse[];
                setHouses(Array.isArray(rows) ? rows.map(h => ({ ...h, reservedByMe: false })) : []);
            } catch (e: any) {
                if (axios.isCancel?.(e)) return;
                setThError(e?.message ?? "Error");
            } finally {
                setThLoading(false);
            }
        })();
        return () => controller.abort();
    }, [tab, houses.length, i18n.language]);

    return (
        <div>
            <div className="space-y-8 pb-8">
                {seo}

                {/* Hero: logo + text + phones (UNCHANGED) */}
                <section className="text-center space-y-6">
                    {/* Logo + Brand capsule */}
                    <div className="inline-flex items-center gap-3 rounded-2xl border bg-white/80 backdrop-blur px-4 py-2 shadow-sm mx-auto">
                        <img
                            src={logoMilonUrl}
                            alt="Milon Mining"
                            className="h-10 w-auto"
                        />
                        <div className="text-left">
                            <div className="text-sm font-semibold leading-tight">
                                {t("brandName", "Milon Mining")}
                            </div>
                            <div className="text-[11px] text-black/60">
                                {t("brandTagline", "Կառուցապատող ընկերություն")}
                            </div>
                        </div>
                    </div>
                    {/* Description */}
                    <p className="max-w-2xl mx-auto text-base sm:text-lg text-black/70">
                        {t("home.welcomeText")}
                    </p>

                    {/* Phones as subtle CTA buttons */}
                    <div className="flex items-center justify-center gap-3">
                        <a
                            href="tel:+37460770909"
                            className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 shadow-sm"
                        >
                            <FaPhoneAlt className="opacity-70" />
                            <span>+374 60 770909</span>
                        </a>
                        <a
                            href="tel:+37491115566"
                            className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 shadow-sm"
                        >
                            <FaPhoneAlt className="opacity-70" />
                            <span>+374 91 115566</span>
                        </a>
                    </div>
                </section>
            </div>

            {/* ---- Apartments tab ---- */}

            {tab === "apartments" && (
                (Array.isArray(projects) && projects.length > 0) ? (
                    <>
                        <ProjectCarousel
                            projects={projects}
                            onBook={(p) => {
                                // go to /apartments with this project's id and images for the top slideshow
                                navigate(`/apartments?building=${p.id}`, {
                                    state: { buildingId: p.id, buildingName: p.name, images: p.images ?? [] }
                                });
                            }}
                        />

                        {drawerOpen && activeProject && (
                            <BookingDrawer
                                project={activeProject}
                                open={drawerOpen}
                                onClose={() => setDrawerOpen(false)}
                            />
                        )}
                    </>
                ) : (
                    <ComingSoon
                        hours={24}
                        storageKey="landing-apartments-deadline"
                        className=""
                    />
                )
            )}


            {/* ---- Townhouses tab ---- */}
            {tab === "townhouses" && (
                (Array.isArray(houses) && houses.length > 0) ? (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                                available ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"
                            }`}
                            onClick={() => setAvailable((v) => !v)}
                        >
                            {available ? t("booking.filters.available.on", "Առկա") : t("booking.filters.available.off", "Պահված + Վաճառված")}
                        </button>
                    </div>
                    {thError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {thError}
                        </div>
                    )}
                    {thLoading && <div className="text-sm text-black/70">{t("common.loading")}</div>}

                    {houses.map((h) => (
                        <TownhouseCard
                            key={h.id}
                            data={h}
                            onPreviewImages={(imgs) => setPreviewImages(imgs)}
                            onPreviewModels={(imgs) => setPreviewImages(imgs)}
                            onReserve={() => setReserveFor({ id: h.id, square_meter: h.square_meter })}
                        />
                    ))}
                </section>
            ) : (
                    <ComingSoon
                        hours={24}
                        storageKey="landing-apartments-deadline"
                        className=""
                    />
                )
            )}

            <ApartmentsCarousel />
            {/* Keep your highlights after the lists */}
            <FeatureHighlights />
            {/* Shared modals for townhouses */}
            {previewImages && (
                <GalleryModal
                    images={previewImages}
                    index={0}
                    onClose={() => setPreviewImages(null)}
                    onPrev={() => {}}
                    onNext={() => {}}
                />
            )}

            {reserveFor && (
                <ReserveModal
                    kind="houses"
                    unit={{ id: reserveFor.id, square_meter: reserveFor.square_meter, floor_level: 0 }}
                    onClose={() => setReserveFor(null)}
                    onSubmit={async (payload) => {
                        try {
                            await postWithCsrf("/reserve/houses", {
                                relation_id: reserveFor.id,
                                name: payload.name,
                                phone: payload.phone,
                                lang: i18n.language
                            });
                            try {
                                await sendBitrixReserve({
                                    kind: "houses",
                                    relationId: reserveFor.id,
                                    name: payload.name,
                                    phone: payload.phone,
                                    locale: i18n.language,
                                    requestType: "reserve",
                                });
                            } catch (error) {
                                console.error("Bitrix send failed:", error);
                            }
                            setHouses(prev =>
                                prev.map(h =>
                                    h.id === reserveFor.id
                                        ? { ...h, reservedByMe: true, status: h.status === "active" ? "reserved" : h.status }
                                        : h
                                )
                            );
                            toast.success(
                                t("booking.reserveSent", { name: payload.name, phone: payload.phone })
                            );
                        } catch (err: any) {
                            console.error("Reserve request failed:", err);
                            toast.error(t("reserve.errors.server", "Սերվերի սխալ, փորձեք կրկին"));
                        } finally {
                            setReserveFor(null);
                        }
                    }}
                />
            )}
        </div>
    );
}

/* ---------------- TownhouseCard (local) ---------------- */
function TownhouseCard({
                           data,
                           onPreviewImages,
                           onPreviewModels,
                           onReserve,
                       }: {
    data: Townhouse;
    onPreviewImages: (images: string[]) => void;
    onPreviewModels: (images: string[]) => void;
    onReserve: () => void;
}) {
    const { t } = useTranslation();
    const thumbs = (data.images || []).slice(0, 3);
    const [main, setMain] = useState<string | null>(data.images?.[0] ?? null);
    const isActive = data.status === "active" && !data.reservedByMe;

    return (
        <article
            className={`relative rounded-3xl border-2 bg-white overflow-hidden shadow-lg transition
        ${isActive ? "border-emerald-500" : "border-slate-200"} hover:shadow-xl`}
        >
            <div className="relative h-56 bg-slate-100">
                {main ? (
                    <img
                        src={main}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        onClick={() => onPreviewImages(data.images)}
                        style={{ cursor: "zoom-in" }}
                    />
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-slate-500">—</div>
                )}

                {/* image column */}
                {thumbs.length > 0 && (
                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                        {thumbs.map((src) => (
                            <button
                                key={src}
                                onClick={() => setMain(src)}
                                className="w-16 h-12 rounded-md border overflow-hidden bg-white/70 hover:bg-white"
                                title={t("booking.preview")}
                            >
                                <img src={src} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                {/* status badge */}
                <div
                    className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full text-white text-xs px-2 py-1 shadow ${
                        data.reservedByMe ? "bg-emerald-700"
                            : data.status === "active" ? "bg-emerald-600"
                                : "bg-slate-900"
                    }`}
                >
          <span>
          {data.reservedByMe
              ? t("booking.status.reservedByMe", "Ամրագրել եք")
              : data.status === "active"
                  ? t("booking.status.active")
                  : data.status === "reserved"
                      ? t("booking.status.reserved")
                      : t("booking.status.sold")}
        </span>
                </div>
            </div>

            <div className="p-4 grid grid-cols-3 gap-3 text-sm">
                <Info label={t("townhouse.card.sqm")} value={`${data.square_meter} ${t("booking.card.sqm")}`} />
                <Info label={t("townhouse.card.terrace")} value={`${data.terrace_size || 0} ${t("booking.card.sqm")}`} />
                <Info label={t("townhouse.card.address")} value={data.address} />
            </div>

            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                <button
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => onPreviewModels(data.model_images || [])}
                    disabled={!data.model_images?.length}
                >
                    {t("townhouse.viewModels")}
                </button>

                <button
                    className={`rounded-xl px-4 py-2 text-sm ${
                        isActive ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                    onClick={() => isActive && onReserve()}
                    disabled={!isActive}
                >
                    {data.reservedByMe ? t("booking.status.reservedByMe", t("booking.already_reserve")) : t("booking.reserve")}

                </button>
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
