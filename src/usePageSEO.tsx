// src/usePageSEO.tsx
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function usePageSEO(title: string, description: string) {
    const { i18n } = useTranslation();

    // 🔒 Hard-fix: միշտ թարմացնենք document.title-ը
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.title = title || "";
            // ուզենաս՝ այստեղ էլ կարող ես meta description-ը ձեռքով թարմացնել
            // let meta = document.querySelector('meta[name="description"]');
            // if (!meta) {
            //   meta = document.createElement('meta');
            //   meta.setAttribute('name', 'description');
            //   document.head.appendChild(meta);
            // }
            // meta.setAttribute('content', description || '');
        }
    }, [title, description, i18n.language]);

    // Helmet՝ keyed by language => ստիպում ենք remount անել meta-ները
    return (
        <Helmet key={`seo-${i18n.language}`}>
            <html lang={i18n.language} />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Helmet>
    );
}
