import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
    /** countdown length in hours (default 24) */
    hours?: number;
    /** localStorage key so the timer persists across refreshes */
    storageKey?: string;
    className?: string;
};

export default function ComingSoon({
                                       hours = 24,
                                       storageKey = "coming-soon-deadline",
                                       className = "",
                                   }: Props) {
    const { t } = useTranslation();

    // Persist the deadline so a refresh doesn't reset the timer
    const initialDeadline = useMemo(() => {
        if (typeof window === "undefined") return Date.now() + hours * 3600_000;
        const saved = window.localStorage.getItem(storageKey);
        const parsed = saved ? Number(saved) : NaN;
        if (Number.isFinite(parsed) && parsed > Date.now()) return parsed;
        const next = Date.now() + hours * 3600_000;
        window.localStorage.setItem(storageKey, String(next));
        return next;
    }, [hours, storageKey]);

    const [deadline] = useState<number>(initialDeadline);
    const [remaining, setRemaining] = useState<number>(deadline - Date.now());

    useEffect(() => {
        const id = setInterval(() => setRemaining(deadline - Date.now()), 1000);
        return () => clearInterval(id);
    }, [deadline]);

    const ms = Math.max(0, remaining);
    const hh = Math.floor(ms / 3_600_000);
    const mm = Math.floor((ms % 3_600_000) / 60_000);
    const ss = Math.floor((ms % 60_000) / 1000);

    const Tile = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur">
            <div className="font-mono text-4xl tabular-nums">{String(value).padStart(2, "0")}</div>
            <div className="text-xs opacity-80">{label}</div>
        </div>
    );

    return (
        <section
            className={
                "my-4 max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-slate-100 shadow-xl " +
                className
            }
        >
            <div className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-300" fill="currentColor" aria-hidden="true">
                    <path d="M12 8a1 1 0 0 1 1 1v3.382l2.447 1.4a1 1 0 1 1-.894 1.788l-3-1.714A1 1 0 0 1 11 13V9a1 1 0 0 1 1-1Z"/>
                    <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Z"/>
                </svg>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold leading-tight">{t("comingSoon.title")}</h2>
                    <p className="text-slate-200/90">{t("comingSoon.subtitle")}</p>
                </div>
            </div>

            {/*<div className="mt-6 flex flex-wrap items-center gap-3">*/}
            {/*    <Tile value={hh} label={t("comingSoon.hours")} />*/}
            {/*    <Tile value={mm} label={t("comingSoon.minutes")} />*/}
            {/*    <Tile value={ss} label={t("comingSoon.seconds")} />*/}
            {/*</div>*/}

            {/* Optional note or CTA */}
            <p className="mt-4 text-sm text-slate-300/80">{t("comingSoon.note")}</p>
        </section>
    );
}
