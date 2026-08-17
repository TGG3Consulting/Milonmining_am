// src/pages/About.tsx
import { useMemo, useState, useEffect } from "react";
import {useTranslation} from "react-i18next";
import usePageSEO from "../usePageSEO";
import MapEmbed from "../components/MapEmbed";
import {FaPhoneAlt} from "react-icons/fa";
import logoMilonUrl from "/logo_milon.png";

export default function AboutPage() {
    const {t, i18n} = useTranslation();

    const pageTitle = `${t("brand")} - ${t("about.title")}`;
    const pageDesc = t("about.body");

    useEffect(() => {
        document.title = pageTitle;
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [pageTitle, i18n.language]);

    const helmet = usePageSEO(pageTitle, pageDesc);

    const address = t("company.address");
    const phones: string[] = t("company.phones", {returnObjects: true}) as any;
    const materials = t("company.materials.list", {returnObjects: true}) as string[];

    return (
        <div className="space-y-12">
            {helmet}
            <div className="flex justify-center">
                <img
                    src={logoMilonUrl}
                    alt="Milon Mining Logo"
                    className="h-24 object-contain"
                />
            </div>
            {/* Hero */}
            <section className="text-center space-y-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            {t("company.name")}
          </span>
                </h1>
                <p className="text-lg text-black/70">{t("about.body")}</p>
                <div className="flex items-center justify-center gap-3">
                    <a
                        href="tel:+37460770909"
                        className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 shadow-sm"
                    >
                        <FaPhoneAlt className="opacity-70" />
                        <span>+374 60 770909</span>
                    </a>
                    <a
                        href="tel:+37491115566"
                        className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 shadow-sm"
                    >
                        <FaPhoneAlt className="opacity-70" />
                        <span>+374 91 115566</span>
                    </a>
                </div>
            </section>

            <MapEmbed />


            {/* Story */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">{t("about.companyTitle")}</h2>
                <p className="leading-7 text-black/80">{t("about.companyText")}</p>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white shadow p-6">
                    <h2 className="text-xl font-semibold">{t("company.materials.title")}</h2>
                    <p className="mb-3 text-sm text-black/80">{t("company.materials.tagline")}</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {materials.map((li) => (
                            <li key={li}>{li}</li>
                        ))}
                    </ul>
                    <div className="pt-2 space-y-1">
                        {phones.map((p) => (
                            <a key={p} href={`tel:${p.replace(/\s|\+/g, "")}`}
                               className="block text-blue-600 hover:underline">
                                {p}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            {/* Roadmap / Timeline */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold">{t("about.timelineTitle")}</h2>

                {/* milestones քաշում ենք i18n-ից */}
                <div className="relative pl-8">
                    {/* vertical line */}
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />

                    {(["t2005","t2010","t2016","t2021","t2022","t2023"] as const).map((key, idx, arr) => (
                        <TimelineItem
                            key={key}
                            year={t(`company.timeline.${key}.year`)}
                            title={t(`company.timeline.${key}.title`)}
                            text={t(`company.timeline.${key}.text`)}
                            isLast={idx === arr.length - 1}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function TimelineItem({
                          year,
                          title,
                          text,
                          isLast,
                      }: {
    year: string;
    title: string;
    text: string;
    isLast?: boolean;
}) {
    return (
        <div className={`relative pb-8 ${isLast ? "pb-0" : ""}`}>
            {/* marker */}
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 border-4 border-white shadow" />
            {/* content */}
            <div className="ml-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 text-white text-xs px-3 py-1 mb-2 shadow-sm">
                    <span className="font-bold text-[15px]">{year} · <span className="font-medium">{title}</span></span>
                </div>
                <div className="rounded-xl bg-white shadow p-4 border text-sm leading-7 text-black/80">
                    {text}
                </div>
            </div>
        </div>
    );
}


