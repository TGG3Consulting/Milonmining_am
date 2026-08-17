// src/pages/Decisions.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePageSEO from "../usePageSEO";
import { FaFilePdf } from "react-icons/fa";

const PLAZA_FILE = "/docs/shin-tuyltvutyun-ogostosi-23-erkaracgum.pdf";

export default function DecisionsPage() {
    const { t, i18n } = useTranslation();

    const pageTitle = `${t("brand")} - ${t("decisions.title")}`;
    const pageDesc = t("decisions.plaza.text");

    useEffect(() => {
        document.title = pageTitle;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageTitle, i18n.language]);

    const helmet = usePageSEO(pageTitle, pageDesc);

    return (
        <div className="space-y-8">
            {helmet}

            {/* Hero */}
            <section className="text-center space-y-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            {t("decisions.title")}
          </span>
                </h1>
            </section>

            {/* Objavlenie */}
            <article className="rounded-2xl bg-white shadow border p-6 sm:p-8">
                {/* data sprava sverhu */}
                <div className="flex justify-end">
                    <time
                        dateTime="2026-02-27"
                        className="text-sm text-slate-400 tabular-nums"
                    >
                        {t("decisions.plaza.date")}
                    </time>
                </div>

                <p className="mt-2 leading-7 text-black/80">
                    {t("decisions.plaza.text")}
                </p>

                <a
                    href={PLAZA_FILE}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 shadow-sm"
                >
                    <FaFilePdf className="text-red-600" />
                    <span>{t("decisions.plaza.fileName")}</span>
                </a>
            </article>
        </div>
    );
}
