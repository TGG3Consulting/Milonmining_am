// src/pages/Apartments.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import GalleryModal from "../components/GalleryModal";
import ReserveModal from "../components/ReserveModal";
import { postWithCsrf } from "../lib/api";
import { sendBitrixReserve } from "../lib/bitrix";
import { createPortal } from "react-dom";

type Status = "active" | "reserved" | "sold";

type Unit = {
    id: number;
    number?: string | number | null;
    building?: string | null;
    block?: string | null;
    floor_level: number;
    rooms: number;
    square_meter: number;
    price: number | null;
    status: Status;
    discount?: number;
    discount_price?: number | null;
    image?: string; // unit overlay
    parent_image?: string; // floor plan
};

type AFilters = {
    priceFrom?: number | null;
    priceTo?: number | null;
    squareFrom?: number | null;
    sort?: "price_desc" | "price_asc" | "size_desc" | "size_asc";
    rooms?: number | null;
    duplex?: boolean | null;
};

type Building = {
    id: number;
    name: string;
    images?: string[];
    gallery?: string[];
    slides?: string[];
};

export default function ApartmentsPage() {
    const { t, i18n } = useTranslation();
    const API = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");
    const [sp] = useSearchParams();
    const location = useLocation() as any;

    // Details drawer state (SINGLE SOURCE OF TRUTH)
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [details, setDetails] = useState<{
        id: number;
        number?: string | number | null;
        building?: string | null;
        block?: string | null;
        images: string[];
        status: Status;
        discount?: number;
        floorLabel: string;
        areaLabel: string;
        sqm: number;
        // NEW
        rooms: number;
        price: number | null | undefined;
        discountPrice: number | null | undefined;
    } | null>(null);

    const buildingId =
        Number(sp.get("building")) ||
        Number(location?.state?.buildingId) ||
        undefined;

    const buildingNameFromState: string | undefined =
        location?.state?.buildingName;
    const initialImages: string[] = Array.isArray(location?.state?.images)
        ? location.state.images
        : [];

    /* ---------------- Projects ---------------- */
    const [projects, setProjects] = useState<Building[]>([]);
    const [projectId, setProjectId] = useState<number | undefined>(buildingId);

    useEffect(() => {
        const controller = new AbortController();
        axios
            .get(`${API}/buildings`, {
                signal: controller.signal,
                headers: { Accept: "application/json" },
                params: { lang: i18n.language },
            })
            .then((res) => {
                const rows = (res.data?.data ?? res.data ?? []) as any[];
                const list: Building[] = Array.isArray(rows)
                    ? rows.map((r) => ({
                        id: Number(r.id),
                        name: String(r.name ?? r.title ?? ""),
                        images: r.images as string[] | undefined,
                        gallery: r.gallery as string[] | undefined,
                        slides: r.slides as string[] | undefined,
                    }))
                    : [];
                setProjects(list);
            })
            .catch(() => {})
            .finally(() => controller.abort());
    }, [API, i18n.language]);

    const activeProject = useMemo(
        () => projects.find((p) => p.id === projectId),
        [projects, projectId]
    );

    const activeProjectName = activeProject?.name ?? buildingNameFromState;

    /* ---------------- Hero (slideshow) ---------------- */
    const [hero, setHero] = useState<string[]>(initialImages);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (projectId === undefined) {
            setHero([]);
            setIdx(0);
        }
    }, [projectId]);

    useEffect(() => {
        if (!projectId) return;
        const imgs =
            (activeProject?.images ??
                activeProject?.gallery ??
                activeProject?.slides ??
                []) as string[];
        if (Array.isArray(imgs) && imgs.length) {
            setHero(imgs);
            setIdx(0);
        }
    }, [projectId, activeProject]);

    useEffect(() => {
        if (hero.length <= 1) return;
        const id = setInterval(() => setIdx((i) => (i + 1) % hero.length), 4500);
        return () => clearInterval(id);
    }, [hero]);

    /* ---------------- Filters ---------------- */
    const [filters, setFilters] = useState<AFilters>({ sort: "price_desc" });
    const applyFilter = (patch: Partial<AFilters>) =>
        setFilters((f) => ({ ...f, ...patch }));
    const [availableOnly, setAvailableOnly] = useState(true);

    /* ---------------- Data & pagination ---------------- */
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const inflightKey = useRef<string | null>(null);

    useEffect(() => {
        setUnits([]);
        setHasMore(true);
        setPage((p) => (p === 1 ? p : 1));
    }, [
        projectId,
        availableOnly,
        filters.priceFrom,
        filters.priceTo,
        filters.squareFrom,
        filters.sort,
        filters.rooms,
        filters.duplex,
        i18n.language,
    ]);

    const baseParams = useMemo(() => {
        const p: Record<string, any> = {
            lang: i18n.language,
            available: availableOnly ? 1 : 0,
        };
        if (projectId) p.building_id = projectId;
        if (filters.priceFrom != null) p.price_from = filters.priceFrom;
        if (filters.priceTo != null) p.price_to = filters.priceTo;
        if (filters.squareFrom != null) p.square_from = filters.squareFrom;
        if (filters.sort) p.sort = filters.sort;
        if (filters.rooms != null) p.rooms = filters.rooms;
        if (filters.duplex) p.duplex = 1;
        return p;
    }, [i18n.language, projectId, availableOnly, filters]);

    const fetchPage = async (pageToLoad: number, append: boolean) => {
        const key = `${JSON.stringify(baseParams)}|${pageToLoad}`;
        if (inflightKey.current === key) return;
        inflightKey.current = key;

        const controller = new AbortController();
        try {
            append ? setLoadingMore(true) : (setLoading(true), setErr(null));
            const res = await axios.get(`${API}/apartments`, {
                signal: controller.signal,
                headers: { Accept: "application/json" },
                params: { ...baseParams, page: pageToLoad },
            });

            const raw = res.data;
            const pg =
                raw?.data && raw.data?.data && Array.isArray(raw.data.data)
                    ? raw.data
                    : raw?.data && Array.isArray(raw.data)
                        ? { data: raw.data, meta: raw.meta }
                        : Array.isArray(raw)
                            ? { data: raw }
                            : raw || {};

            const rows = (Array.isArray(pg.data) ? pg.data : []) as Unit[];

            const meta =
                pg.meta ??
                (pg.current_page
                    ? {
                        current_page: Number(pg.current_page),
                        last_page: Number(pg.last_page ?? pg.current_page),
                        total: Number(pg.total ?? rows.length),
                        per_page: Number(pg.per_page ?? rows.length),
                    }
                    : undefined);

            setUnits((prev) => (append ? [...prev, ...rows] : rows));

            if (meta) {
                setHasMore(meta.current_page < meta.last_page);
            } else {
                setHasMore(rows.length > 0);
            }
        } catch (e: any) {
            if (
                axios.isCancel?.(e) ||
                e?.code === "ERR_CANCELED" ||
                e?.name === "CanceledError"
            )
                return;
            setErr(e?.message ?? "Error");
            if (!append) setUnits([]);
            setHasMore(false);
        } finally {
            inflightKey.current = null;
            append ? setLoadingMore(false) : setLoading(false);
        }
    };

    useEffect(() => {
        if (page === 1) fetchPage(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseParams, page]);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const rootEl = scrollRef.current;
        const sentinel = sentinelRef.current;
        if (!rootEl || !sentinel) return;

        const io = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
                    const next = page + 1;
                    setPage(next);
                    fetchPage(next, true);
                }
            },
            { root: rootEl, rootMargin: "200px 0px", threshold: 0.01 }
        );

        io.observe(sentinel);
        return () => io.disconnect();
    }, [hasMore, loadingMore, loading, page]);

    /* ---------------- Modals ---------------- */
    const [preview, setPreview] = useState<string[] | null>(null);
    const [reserveFor, setReserveFor] = useState<{
        id: number;
        number?: string | number | null;
        building?: string | null;
        block?: string | null;
        floor_level?: number;
        sqm: number;
        rooms?: number;
    } | null>(null);

    /* ---------------- UI ---------------- */
    const isFilterDirty = Boolean(
        filters.priceFrom != null ||
        filters.priceTo != null ||
        filters.squareFrom != null ||
        (filters.sort && filters.sort !== "price_desc") ||
        filters.rooms != null ||
        filters.duplex ||
        projectId !== buildingId ||
        !availableOnly
    );

    const [mFilterOpen, setMFilterOpen] = useState(false);

    const activeBadges: string[] = [];
    if (projectId) {
        const p = projects.find((x) => x.id === projectId);
        if (p?.name) activeBadges.push(p.name);
    }
    if (filters.rooms != null)
        activeBadges.push(
            `${filters.rooms} ${t("booking.rooms.n", {
                count: filters.rooms,
                defaultValue: "սենյակ",
            })}`
        );
    if (filters.duplex) activeBadges.push(t("booking.filters.duplex.yes", "Դուպլեքս"));
    if (filters.priceFrom != null)
        activeBadges.push(`${t("filters.price_from")}: ${filters.priceFrom}`);
    if (filters.priceTo != null)
        activeBadges.push(`${t("filters.price_to")}: ${filters.priceTo}`);
    if (filters.squareFrom != null)
        activeBadges.push(`${t("filters.square_from")}: ${filters.squareFrom}`);
    if (filters.sort && filters.sort !== "price_desc")
        activeBadges.push(t(`filters.sort.${filters.sort}`));
    if (!availableOnly) activeBadges.push(t("booking.filters.available.off"));

    const [reserveSuccess, setReserveSuccess] = useState<{
        name: string;
        phone: string;
    } | null>(null);

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
        rooms?: number;
    }) =>
        [
            unit.building ? `${unit.building}` : activeProjectName ?? null,
            unit.block ? `Մուտք ${unit.block}` : null,
            `Բնակարան #${unit.number ?? unit.id}`,
            unit.floor_level != null ? `${unit.floor_level} հարկ` : null,
            unit.sqm != null ? `${unit.sqm} ք.մ.` : null,
            unit.rooms != null ? `${unit.rooms} սենյակ` : null,
        ]
            .filter(Boolean)
            .join(", ");

    const resetFilters = () => {
        setProjectId(buildingId);
        setFilters({
            sort: "price_desc",
            rooms: null,
            duplex: null,
            priceFrom: null,
            priceTo: null,
            squareFrom: null,
        } as any);
        setAvailableOnly(true);
    };

    return (
        <div className="space-y-8">
            {/* Hero slideshow */}
            {projectId && hero.length > 0 && (
                <section className="relative left-1/2 -ml-[50vw] w-[100vw] -mt-8 h-[60svh] md:h-[70svh] overflow-hidden rounded-b-3xl z-[0]">
                    {hero.map((src, i) => (
                        <img
                            key={src + i}
                            src={src}
                            alt=""
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                idx === i ? "opacity-100" : "opacity-0"
                            }`}
                            loading={i === 0 ? "eager" : "lazy"}
                        />
                    ))}

                    {activeProjectName && (
                        <div className="absolute bottom-4 left-1/2 -trangreen-x-1/2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium shadow">
                            {activeProjectName}
                        </div>
                    )}

                    {hero.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -trangreen-x-1/2 flex gap-2">
                            {hero.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIdx(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    className={`w-2.5 h-2.5 rounded-full ${
                                        i === idx ? "bg-white" : "bg-white/50"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Title */}
            <h2 className="text-xl font-semibold">{t("home.units", "Բնակարաններ")}</h2>

            {/* Mobile quick filters */}
            <div className="lg:hidden space-y-3">
                <div className="flex items-center gap-2">
                    <select
                        className="flex-1 rounded-xl border px-3 py-2"
                        value={projectId ?? ""}
                        onChange={(e) =>
                            setProjectId(e.target.value ? Number(e.target.value) : undefined)
                        }
                    >
                        <option value="">{t("filters.project_all", "Բոլորը")}</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <button
                        className="rounded-xl border px-3 py-2"
                        onClick={() => setMFilterOpen(true)}
                    >
                        {t("filters.title", "Ֆիլտր")}
                    </button>
                </div>

                <div className="flex flex-col gap-y-2">
          <span className="text-sm text-black/70">
            {t("filters.rooms", "Սենյակներ")}
          </span>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                onClick={() =>
                                    applyFilter({ rooms: filters.rooms === n ? null : n })
                                }
                                className={`px-3 py-2 rounded-lg border text-sm ${
                                    filters.rooms === n
                                        ? "bg-green-900 text-white border-green-900"
                                        : "hover:bg-green-50 bg-gray-50"
                                }`}
                            >
                                {n}
                            </button>
                        ))}

                        {isFilterDirty && (
                            <button
                                className="ml-auto text-sm rounded-xl border px-3 py-2"
                                onClick={resetFilters}
                            >
                                {t("filters.reset", "Մաքրել")}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid lg:grid-cols-12 gap-6">
                {/* Sidebar */}
                <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
                    <div className="sticky top-6 rounded-2xl border bg-white/80 backdrop-blur p-5 shadow space-y-4">
                        <h3 className="text-lg font-semibold">{t("filters.title", "Ֆիլտր")}</h3>

                        <label className="text-sm block">
                            <span className="block mb-1">{t("filters.project", "Նախագիծ")}</span>
                            <select
                                className="w-full rounded-xl border px-3 py-2"
                                value={projectId ?? ""}
                                onChange={(e) =>
                                    setProjectId(e.target.value ? Number(e.target.value) : undefined)
                                }
                            >
                                <option value="">{t("filters.project_all", "Բոլորը")}</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="grid grid-cols-1 gap-3">
                            <label className="text-sm">
                                <span className="block mb-1">{t("filters.price_from", "Գին՝ սկիզբ")}</span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.priceFrom ?? ""}
                                    onChange={(e) =>
                                        applyFilter({
                                            priceFrom: e.target.value ? Number(e.target.value) : null,
                                        })
                                    }
                                />
                            </label>
                            <label className="text-sm">
                                <span className="block mb-1">{t("filters.price_to", "Գին՝ վերջ")}</span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.priceTo ?? ""}
                                    onChange={(e) =>
                                        applyFilter({
                                            priceTo: e.target.value ? Number(e.target.value) : null,
                                        })
                                    }
                                />
                            </label>
                        </div>

                        <label className="text-sm block">
                            <span className="block mb-1">{t("filters.square_from", "Մակերես ≥")}</span>
                            <input
                                type="number"
                                className="w-full rounded-xl border px-3 py-2"
                                value={filters.squareFrom ?? ""}
                                onChange={(e) =>
                                    applyFilter({
                                        squareFrom: e.target.value ? Number(e.target.value) : null,
                                    })
                                }
                            />
                        </label>

                        <div className="text-sm">
                            <div className="mb-1">{t("booking.rooms.title", "Սենյակներ")}</div>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() =>
                                            applyFilter({ rooms: filters.rooms === n ? null : n })
                                        }
                                        className={`px-3 py-2 rounded-lg border text-sm ${
                                            filters.rooms === n
                                                ? "border-green-900 text-white bg-green-900"
                                                : "hover:bg-green-50"
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="text-sm inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="rounded border-green-300"
                                checked={!!filters.duplex}
                                onChange={(e) => applyFilter({ duplex: e.target.checked ? true : null })}
                            />
                            <span>{t("booking.filters.duplex.yes", "Դուպլեքս")}</span>
                        </label>

                        <label className="text-sm block">
                            <span className="block mb-1">{t("filters.sort.title", "Դասավորել")}</span>
                            <select
                                className="w-full rounded-xl border px-3 py-2"
                                value={filters.sort ?? "price_desc"}
                                onChange={(e) =>
                                    applyFilter({ sort: e.target.value as AFilters["sort"] })
                                }
                            >
                                <option value="price_desc">
                                    {t("filters.sort.price_asc", "Գին՝ ց.→բ.")}
                                </option>
                                <option value="price_asc">
                                    {t("filters.sort.price_desc", "Գին՝ բ.→ց.")}
                                </option>
                                <option value="size_desc">
                                    {t("filters.sort.size_desc", "Մակերես՝ բ.→ց.")}
                                </option>
                                <option value="size_asc">
                                    {t("filters.sort.size_asc", "Մակերես՝ ց.→բ.")}
                                </option>
                            </select>
                        </label>

                        <button
                            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                                availableOnly
                                    ? "bg-green-900 text-white border-green-900"
                                    : "bg-white hover:bg-green-50"
                            }`}
                            onClick={() => setAvailableOnly((v) => !v)}
                        >
                            {availableOnly
                                ? t("booking.filters.available.on", "Առկա")
                                : t("booking.filters.available.off", "Պահված + Վաճառված")}
                        </button>

                        {isFilterDirty && (
                            <button
                                className="w-full rounded-xl border-2 border-gray-300 py-2 hover:bg-gray-50"
                                onClick={() => {
                                    setProjectId(buildingId);
                                    setFilters({ sort: "price_desc" });
                                    setAvailableOnly(true);
                                }}
                            >
                                {t("filters.reset", "Մաքրել")}
                            </button>
                        )}
                    </div>
                </aside>

                {/* Scrollable content column */}
                <section
                    className="lg:col-span-8 xl:col-span-9 overflow-auto rounded-2xl"
                    ref={scrollRef}
                    style={{ maxHeight: "70svh" }}
                >
                    {err && !units.length && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {err}
                        </div>
                    )}
                    {loading && !units.length && (
                        <div className="mb-4 text-sm text-green-600">
                            {t("common.loading", "Բեռնվում է…")}
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
                        {units.map((u) => (
                            <article
                                key={u.id}
                                className="relative overflow-hidden rounded-2xl border bg-white shadow"
                            >
                                {/* combined preview */}
                                <div
                                    className="relative h-44 bg-white cursor-zoom-in"
                                    onClick={() =>
                                        setPreview(
                                            [u.parent_image, u.image].filter(Boolean) as string[]
                                        )
                                    }
                                    title={t("booking.preview", "Նախադիտել") as string}
                                >
                                    {u.parent_image && (
                                        <img
                                            src={u.parent_image}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    )}
                                    {u.image && (
                                        <img
                                            src={u.image}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    )}
                                    {!u.parent_image && !u.image && (
                                        <div className="absolute inset-0 grid place-items-center text-green-400">
                                            —
                                        </div>
                                    )}

                                    {u.discount && u.discount > 0 && (
                                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 text-xs font-medium">
                      {t("discount", "Զեղչ")} {u.discount}%
                    </span>
                                    )}

                                    <span
                                        className={`absolute top-3 right-3 text-xs text-white px-2.5 py-1 rounded-full ${
                                            u.status === "active"
                                                ? "bg-emerald-600"
                                                : u.status === "reserved"
                                                    ? "bg-amber-500"
                                                    : "bg-rose-600"
                                        }`}
                                    >
                    {t(`booking.status.${u.status}`)}
                  </span>
                                </div>

                                <div className="p-4 grid grid-cols-3 gap-3 text-sm">
                                    <div className="col-span-3 rounded-xl border px-3 py-2">
                                        <div className="text-[11px] text-black/60">
                                            {t("booking.card.price")}
                                        </div>
                                        {typeof u.discount_price === "number" &&
                                        typeof u.price === "number" &&
                                        u.discount_price !== u.price ? (
                                            <div className="font-semibold flex flex-col">
                        <span className="line-through text-black/40 mr-2">
                          {u.price.toLocaleString()} {t("units.amd", "AMD")}
                        </span>
                                                <span className="text-emerald-700 font-bold">
                          {u.discount_price.toLocaleString()}{" "}
                                                    {t("units.amd", "AMD")}
                        </span>
                                            </div>
                                        ) : (
                                            <div className="font-semibold">
                                                {typeof u.price === "number"
                                                    ? `${u.price.toLocaleString()} ${t(
                                                        "units.amd",
                                                        "AMD"
                                                    )}`
                                                    : t("booking.price.soon")}
                                            </div>
                                        )}
                                    </div>
                                    <Info
                                        label={t("booking.card.floor")}
                                        value={t("reserve.floorN", { n: u.floor_level })}
                                    />
                                    <Info
                                        label={t("booking.card.area")}
                                        value={`${u.square_meter} ${t("booking.card.sqm")}`}
                                    />
                                    <Info label={t("filters.bed")} value={`${u.rooms}`} />
                                </div>

                                <div className="px-4 pb-4">
                                    <button
                                        className="w-full rounded-xl px-4 py-2 text-sm bg-green-900 text-white hover:bg-green-800"
                                        onClick={() => {
                                            const images = [u.parent_image, u.image].filter(
                                                Boolean
                                            ) as string[];
                                            setDetails({
                                                id: u.id,
                                                number: u.number,
                                                building: u.building ?? activeProjectName ?? null,
                                                block: u.block ?? null,
                                                images,
                                                status: u.status,
                                                discount: u.discount,
                                                floorLabel: t("reserve.floorN", { n: u.floor_level }),
                                                areaLabel: `${u.square_meter} ${t("booking.card.sqm")}`,
                                                sqm: u.square_meter,
                                                // NEW:
                                                rooms: u.rooms,
                                                price: u.price,
                                                discountPrice: u.discount_price ?? null,
                                            });
                                            setDetailsOpen(true);
                                        }}
                                    >
                                        {t("common.viewMore", "Տեսնել ավելին")}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {(loadingMore || (loading && units.length > 0)) && (
                        <div className="py-4 text-center text-sm text-green-500">
                            {t("common.loading", "Բեռնվում է…")}
                        </div>
                    )}

                    <div ref={sentinelRef} className="h-6" />

                    {!loading && !loadingMore && !hasMore && units.length > 0 && (
                        <div className="py-4 text-center text-xs text-green-400">
                            {t("list.end", "Ավարտ")}
                        </div>
                    )}
                </section>
            </div>

            {/* Modals */}
            {preview && (
                <GalleryModal
                    images={preview}
                    index={0}
                    onClose={() => setPreview(null)}
                    onPrev={() => {}}
                    onNext={() => {}}
                />
            )}

            {reserveFor && (
                <ReserveModal
                    kind="apartments"
                    unit={{ id: reserveFor.id, number: String(reserveFor.number ?? reserveFor.id), square_meter: reserveFor.sqm, floor_level: reserveFor.floor_level ?? 0 }}
                    onClose={() => setReserveFor(null)}
                    onSubmit={async (payload, type) => {
                        try {
                            if (type === "callback") {
                                // 👉 հետ զանգի հայտ
                                await postWithCsrf("/reserve/apartments", {
                                    relation: "apartment",
                                    relation_id: reserveFor.id,
                                    name: payload.name,
                                    phone: payload.phone,
                                    lang: i18n.language,
                                    type
                                });
                                try {
                                    await sendBitrixReserve({
                                        kind: "apartments",
                                        relationId: reserveFor.id,
                                        name: payload.name,
                                        phone: payload.phone,
                                        locale: i18n.language,
                                        requestType: type,
                                        unitSummary: buildApartmentSummary(reserveFor),
                                        apartmentNumber: reserveFor.number ?? reserveFor.id,
                                        floor: reserveFor.floor_level ?? '',
                                        squareMeter: reserveFor.sqm ?? "",
                                    });
                                } catch (error) {
                                    console.error("Bitrix send failed:", error);
                                }
                                setReserveSuccess({ name: payload.name, phone: payload.phone });
                            } else {
                                // 👉 ստանդարտ ամրագրում
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
                                        squareMeter: reserveFor.sqm ?? "",
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
                                        phone: payload.phone,
                                    });
                                } else {
                                    setReserveSuccess({ name: payload.name, phone: payload.phone });
                                }
                            }
                        } finally {
                            setReserveFor(null);
                        }
                    }}
                />
            )}

            {detailsOpen && details && (
                <UnitDetailsDrawer
                    open={detailsOpen}
                    onClose={() => setDetailsOpen(false)}
                    images={details.images}
                    status={details.status}
                    discount={details.discount}
                    floorLabel={details.floorLabel}
                    areaLabel={details.areaLabel}
                    rooms={details.rooms}
                    price={details.price}
                    discountPrice={details.discountPrice}
                    onReserve={() => {
                        setDetailsOpen(false);
                        setReserveFor({
                            id: details.id,
                            number: details.number,
                            building: details.building,
                            block: details.block,
                            sqm: details.sqm,
                            floor_level: Number((details.floorLabel.match(/\d+/)?.[0] ?? 0)),
                            rooms: details.rooms,
                        });
                    }}
                />
            )}

            {/* Mobile burger sheet */}
            {mFilterOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMFilterOpen(false)}
                    />
                    <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-white p-4 overflow-auto">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="text-lg font-semibold">
                                {t("filters.title", "Ֆիլտր")}
                            </h3>
                            <div className="flex flex-wrap gap-2 justify-end">
                                {activeBadges.map((b, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-green-100 border px-2 py-0.5 text-xs"
                                    >
                    {b}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                                    availableOnly
                                        ? "bg-green-900 text-white border-green-900"
                                        : "bg-white hover:bg-green-50"
                                }`}
                                onClick={() => {
                                    setAvailableOnly((v) => !v);
                                    setMFilterOpen(false);
                                }}
                            >
                                {availableOnly
                                    ? t("booking.filters.available.on", "Առկա")
                                    : t("booking.filters.available.off", "Պահված + Վաճառված")}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="text-sm">
                  <span className="block mb-1">
                    {t("filters.price_from", "Գին՝ սկիզբ")}
                  </span>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border px-3 py-2"
                                        value={filters.priceFrom ?? ""}
                                        onChange={(e) => {
                                            applyFilter({
                                                priceFrom: e.target.value
                                                    ? Number(e.target.value)
                                                    : null,
                                            });
                                        }}
                                    />
                                </label>
                                <label className="text-sm">
                  <span className="block mb-1">
                    {t("filters.price_to", "Գին՝ վերջ")}
                  </span>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border px-3 py-2"
                                        value={filters.priceTo ?? ""}
                                        onChange={(e) => {
                                            applyFilter({
                                                priceTo: e.target.value ? Number(e.target.value) : null,
                                            });
                                        }}
                                    />
                                </label>
                            </div>

                            <label className="text-sm block">
                <span className="block mb-1">
                  {t("filters.square_from", "Մակերես ≥")}
                </span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.squareFrom ?? ""}
                                    onChange={(e) => {
                                        applyFilter({
                                            squareFrom: e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        });
                                    }}
                                />
                            </label>

                            <label className="text-sm inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-green-300"
                                    checked={!!filters.duplex}
                                    onChange={(e) => {
                                        applyFilter({ duplex: e.target.checked ? true : null });
                                        setMFilterOpen(false);
                                    }}
                                />
                                <span>{t("booking.filters.duplex.yes", "Դուպլեքս")}</span>
                            </label>

                            <label className="text-sm block">
                <span className="block mb-1">
                  {t("filters.sort.title", "Դասավորել")}
                </span>
                                <select
                                    className="w-full rounded-xl border px-3 py-2"
                                    value={filters.sort ?? "price_desc"}
                                    onChange={(e) => {
                                        applyFilter({ sort: e.target.value as any });
                                        setMFilterOpen(false);
                                    }}
                                >
                                    <option value="price_desc">
                                        {t("filters.sort.price_desc", "Գին՝ ց.→բ.")}
                                    </option>
                                    <option value="price_asc">
                                        {t("filters.sort.price_asc", "Գին՝ բ.→ց.")}
                                    </option>
                                    <option value="size_desc">
                                        {t("filters.sort.size_desc", "Մակերես՝ բ.→ց.")}
                                    </option>
                                    <option value="size_asc">
                                        {t("filters.sort.size_asc", "Մակերես՝ ց.→բ.")}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <button
                                className="rounded-xl border px-4 py-2"
                                onClick={() => setMFilterOpen(false)}
                            >
                                {t("common.close", "Փակել")}
                            </button>

                            <div className="flex items-center gap-2">
                                {isFilterDirty && (
                                    <button
                                        className="rounded-xl border-2 border-gray-300 px-4 py-2"
                                        onClick={() => {
                                            resetFilters();
                                            setMFilterOpen(false);
                                        }}
                                    >
                                        {t("filters.reset", "Մաքրել")}
                                    </button>
                                )}
                                <button
                                    className="rounded-xl bg-green-900 text-white px-4 py-2"
                                    onClick={() => setMFilterOpen(false)}
                                >
                                    {t("filters.apply", "Կիրառել")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {garageOffer && (
                <GarageOfferModal
                    loading={garageBusy}
                    onConfirm={async () => {
                        try {
                            setGarageBusy(true);
                            await postWithCsrf(
                                "/reserve/" + garageOffer.request_id + "/want_garage",
                                {
                                    session: garageOffer.session,
                                }
                            );
                        } catch (e) {
                            console.error("Garage confirm failed:", e);
                        } finally {
                            setGarageBusy(false);
                            setReserveSuccess({
                                name: garageOffer.name,
                                phone: garageOffer.phone,
                            });
                            setGarageOffer(null);
                        }
                    }}
                    onSkip={() => {
                        setReserveSuccess({
                            name: garageOffer.name,
                            phone: garageOffer.phone,
                        });
                        setGarageOffer(null);
                    }}
                    onClose={() => {
                        setReserveSuccess({
                            name: garageOffer.name,
                            phone: garageOffer.phone,
                        });
                        setGarageOffer(null);
                    }}
                />
            )}

            {reserveSuccess && (
                <SuccessModal
                    message={t("booking.reserveSent", {
                        name: reserveSuccess.name,
                        phone: reserveSuccess.phone,
                    })}
                    onClose={() => setReserveSuccess(null)}
                />
            )}
        </div>
    );
}

/* ---------------- Drawer component (single implementation) ---------------- */

function UnitDetailsDrawer({
                               open,
                               onClose,
                               images,
                               status,
                               discount,
                               floorLabel,
                               areaLabel,
                               onReserve,
                               // NEW:
                               rooms,
                               price,
                               discountPrice,
                           }: {
    open: boolean;
    onClose: () => void;
    images: string[];
    status: Status;
    discount?: number;
    floorLabel: string;
    areaLabel: string;
    onReserve: () => void;
    rooms: number;
    price: number | null | undefined;
    discountPrice: number | null | undefined;
}) {
    const { t } = useTranslation();

    // lock body scroll while open
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

    const [current, setCurrent] = useState(0);
    const [lb, setLb] = useState<{ images: string[]; index: number } | null>(
        null
    );

    useEffect(() => setCurrent(0), [images.join("|")]);

    if (!open) return null;

    const panel = (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[500] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
                    enter ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />
            {/* Drawer */}
            <aside
                className={`fixed right-0 top-0 z-[510] h-full w-full max-w-[560px] bg-white shadow-2xl border-l transform transition-transform duration-300 ${
                    enter ? "translate-x-0" : "translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 py-3 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        {t("common.details", "Մանրամասներ")}
                    </h3>
                    <button
                        className="rounded-full px-2.5 py-1 text-sm hover:bg-slate-100"
                        onClick={onClose}
                    >
                        {t("common.close", "Փակել")}
                    </button>
                </div>

                <div className="h-[calc(100%-56px)] overflow-y-auto p-4 space-y-4">
                    {/* Gallery */}
                    <div className="relative rounded-xl border overflow-hidden bg-slate-50">
                        {discount && discount > 0 && (
                            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 px-3 py-1 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-700 text-xs font-medium">
                {t("discount", "Զեղչ")} {discount}%
              </span>
                        )}

                        <img
                            src={images[current]}
                            alt=""
                            className="w-full h-64 object-contain bg-white cursor-zoom-in"
                            onClick={() => setLb({ images, index: current })}
                        />

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
                        {/* Price (with discount) */}
                        <div className="col-span-2 rounded-xl border px-3 py-2">
                            <div className="text-[11px] text-black/60">
                                {t("booking.card.price")}
                            </div>
                            {typeof discountPrice === "number" &&
                            typeof price === "number" &&
                            discountPrice !== price ? (
                                <div className="font-semibold flex flex-col">
                  <span className="line-through text-black/40">
                    {price.toLocaleString()} {t("units.amd", "AMD")}
                  </span>
                                    <span className="text-emerald-700 font-bold">
                    {discountPrice.toLocaleString()} {t("units.amd", "AMD")}
                  </span>
                                </div>
                            ) : (
                                <div className="font-semibold">
                                    {typeof price === "number"
                                        ? `${price.toLocaleString()} ${t("units.amd", "AMD")}`
                                        : t("booking.price.soon")}
                                </div>
                            )}
                        </div>

                        <Fact label={t("booking.card.floor")} value={floorLabel} />
                        <Fact label={t("booking.card.area")} value={areaLabel} />
                        <Fact label={t("filters.bed")} value={`${rooms}`} />
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

            {/* Lightbox */}
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

/* ---------------- Small helpers ---------------- */

function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border px-3 py-2">
            <div className="text-[11px] text-black/60">{label}</div>
            <div className="font-semibold">{value}</div>
        </div>
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

/* ---------------- Shared modals ---------------- */

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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M19 5L5 19" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="7" cy="7" r="2" />
                        <circle cx="17" cy="17" r="2" />
                    </svg>
                </div>

                <h3 className="text-lg font-semibold text-center mb-2">
                    {t("garage.offer.title", "Ավելացնե՞լ ավտոկայանատեղի 20% զեղչով")}
                </h3>
                <p className="text-sm text-slate-600 text-center mb-5">
                    {t(
                        "garage.offer.text",
                        "Մենք ունենք հասանելի ավտոկայանատեղիներ։ Կարող եք ամրագրել նաև ավտոտնակը՝ ստանալով 20% զեղչ։"
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-center">
                    <button className="flex-1 sm:flex-none rounded-xl border px-4 py-2" onClick={onSkip}>
                        {t("garage.offer.no", "Ոչ, շնորհակալ եմ")}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-xl px-4 py-2 text-white bg-green-900 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2`}
                    >
                        {loading && <Spinner className="w-4 h-4" />}
                        {t("garage.yes", "Այո, վերցնել")}
                    </button>
                </div>

                <button
                    className="mt-4 w-full text-center text-xs text-black/60 hover:underline"
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

function SuccessModal({
                          message,
                          onClose,
                      }: {
    message: string;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm grid place-items-center">
            <div className="bg-white rounded-2xl p-6 w-[min(90vw,480px)] shadow-xl text-center">
                <div className="mx-auto mb-3 w-12 h-12 grid place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-7 h-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                    {t("common.success", "Հաջողվեց")}
                </h3>
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
    const buildApartmentSummary = (unit: {
        id: number;
        number?: string | number | null;
        floor_level?: number;
        sqm?: number;
        rooms?: number;
    }) =>
        [
            `#${unit.number ?? unit.id}`,
            unit.floor_level != null ? `${unit.floor_level} հարկ` : null,
            unit.sqm != null ? `${unit.sqm} ք.մ.` : null,
            unit.rooms != null ? `${unit.rooms} սենյակ` : null,
        ]
            .filter(Boolean)
            .join("\n");


