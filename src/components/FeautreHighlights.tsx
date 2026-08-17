// src/components/FeatureHighlights.tsx
import { useTranslation } from "react-i18next";
import { FiShield, FiTag, FiCpu } from "react-icons/fi";

export default function FeatureHighlights() {
    const { t } = useTranslation();

    const items = [
        {
            icon: <FiShield className="text-xl" />,
            title: t("features.security.title"),
            desc: t("features.security.desc"),
        },
        {
            icon: <FiTag className="text-xl" />,
            title: t("features.prices.title"),
            desc: t("features.prices.desc"),
        },
        {
            icon: <FiCpu className="text-xl" />,
            title: t("features.modern.title"),
            desc: t("features.modern.desc"),
        },
    ];

    return (
        <section className="mt-8">
            {/* Background panel that separates from projects above */}
            <div
                className="
          relative max-w-6xl mx-auto rounded-3xl ring-1 ring-slate-200/70 shadow-sm overflow-hidden
          bg-slate-900
          bg-[radial-gradient(1200px_400px_at_50%_-200px,rgba(15,23,42,0.06),transparent)]
        "
            >
                {/* subtle top glow */}
                <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-slate-200/60 to-transparent blur-3xl opacity-60" />

                <div className="p-6 md:p-10">
                    <div className="grid gap-6 md:grid-cols-3">
                        {items.map((it, i) => (
                            <article
                                key={i}
                                className="h-full rounded-2xl bg-white p-6 shadow-sm border hover:shadow-md transition flex flex-col gap-3"
                            >
                                <div className="h-11 w-11 rounded-xl bg-slate-900 text-white grid place-items-center shadow">
                                    {it.icon}
                                </div>
                                <h3 className="text-lg font-extrabold tracking-wide">{it.title}</h3>
                                <p className="text-sm leading-6 text-black/70">{it.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
