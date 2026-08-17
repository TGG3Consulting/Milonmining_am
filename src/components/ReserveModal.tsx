// src/components/ReserveModal.tsx
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

type Kind = "apartments" | "houses";
type SubmitType = "reserve" | "callback";

export default function ReserveModal({
                                         kind,
                                         unit,
                                         onClose,
                                         onSubmit,
                                     }: {
    kind: Kind;
    unit?: { id: number; square_meter?: number; floor_level?: number; number?: string };
    onClose: () => void;
    // NOW passes type: "reserve" | "callback"
    onSubmit: (payload: { name: string; phone: string }, type: SubmitType) => Promise<void> | void;
}) {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("+374");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // lock background scroll
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, []);

    const title =
        kind === "apartments"
            ? t("booking.reserveTitle", "Ամրագրել")
            : t("garage.reserveTitle", "Ամրագրել");

    const unitLine =
        unit
            ? `${t("booking.unitLabel", "Բնակարան")} №${unit.number ?? unit.id}${unit.square_meter ? `, ${unit.square_meter} ${t("booking.card.sqm")}` : ""}`
            : "";

    const valid = name.trim().length >= 2 && /^\+374\d{8}$/.test(phone);

    const handle = async (type: SubmitType) => {
        if (busy) return;
        setError(null);
        if (!valid) {
            setError(t("form.invalid", "Խնդրում ենք լրացնել անունը և ճիշտ հեռախոսահամարը (+374XXXXXXXX)") as string);
            return;
        }
        try {
            setBusy(true);
            await onSubmit({ name: name.trim(), phone: phone.trim() }, type);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/50 backdrop-blur-sm">
            <div className="w-[min(92vw,560px)] rounded-2xl bg-white shadow-2xl">
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 hover:bg-slate-100"
                        aria-label={t("common.close", "Փակել") as string}
                    >
                        ×
                    </button>
                </div>

                {/* body */}
                <div className="p-5 space-y-4">
                    {unitLine && <div className="text-sm text-black/70">{unitLine}</div>}

                    <label className="block">
                        <div className="text-xs text-black/60 mb-1">{t("booking.form.name", "Անուն, ազգանուն")}</div>
                        <input
                            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
                            placeholder={t("booking.form.namePh", "Օր․ Անուշիկ Պետրոսյան") as string}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={busy}
                        />
                    </label>

                    <label className="block">
                        <div className="text-xs text-black/60 mb-1">{t("booking.form.phone", "Հեռախոսահամար")}</div>
                        <input
                            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="+374XXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={busy}
                        />
                        <div className="mt-1 text-[11px] text-black/50">
                            {t("booking.form.phoneHint", "Մուտքագրեք համարը այս ձևով՝ +374XXXXXXXX")}
                        </div>
                    </label>

                    {error && <div className="text-sm text-red-600">{error}</div>}
                </div>

                {/* footer */}
                <div className="flex items-center justify-end gap-2 px-5 pb-5">
                    {/* NEW: callback button (used to be Cancel) */}
                    <button
                        type="button"
                        className="rounded-xl bg-sky-900 text-white px-4 py-2 text-sm hover:bg-sky-800 disabled:opacity-50"
                        onClick={() => handle("callback")}
                        disabled={busy}
                    >
                        {t("booking.callback", "Հետ զանգ")}
                    </button>

                    <button
                        type="button"
                        className="rounded-xl bg-green-900 text-white px-4 py-2 text-sm hover:bg-green-800 disabled:opacity-50"
                        onClick={() => handle("reserve")}
                        disabled={busy}
                    >
                        {busy ? t("common.sending", "Ուղարկվում է…") : t("common.send", "Ուղարկել")}
                    </button>
                </div>
            </div>
        </div>
    );
}
