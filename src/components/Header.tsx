// src/components/Header.tsx
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import logoUrl from "/logo.png";

export default function Header() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [showPhones, setShowPhones] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    function changeLang(next: "hy" | "ru") {
        i18n.changeLanguage(next);
        localStorage.setItem("lang", next);
        document.documentElement.lang = next;
    }

    // close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setShowPhones(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Left: logo + nav */}
                <div className="flex items-center gap-6 min-w-0 flex-nowrap">
                    <Link
                        to="/"
                        aria-label="Logo / Home"
                        className="flex items-center gap-2 shrink-0"
                    >
                        <img
                            src={logoUrl}
                            width="28"
                            height="28"
                            alt="Logo"
                            className="block"
                        />
                    </Link>

                    {/* Nav (kept visible; scrolls horizontally on very narrow screens) */}
                    <nav className="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar">


                        <Link
                            to="/apartments"
                            className={`hover:text-black/80 transition ${
                                location.pathname === "/apartments"
                                    ? "text-black"
                                    : "text-black/60"
                            }`}
                            aria-label={t("nav.apartments") as string}
                        >
                            {t("nav.apartments")}
                        </Link>

                        <Link
                            to="/townhouses"
                            className={`hover:text-black/80 transition ${
                                location.pathname === "/townhouses"
                                    ? "text-black"
                                    : "text-black/60"
                            }`}
                            aria-label={t("nav.townhouses") as string}
                        >
                            {t("nav.townhouses")}
                        </Link>
                        <Link
                            to="/about"
                            className={`hover:text-black/80 transition ${
                                location.pathname === "/about" ? "text-black" : "text-black/60"
                            }`}
                            aria-label={t("nav.about") as string}
                        >
                            {t("nav.about")}
                        </Link>
                    </nav>
                </div>

                {/* Right: language + phone */}
                <div className="flex items-center gap-3 shrink-0 relative">
                    <div className="inline-flex rounded-xl overflow-hidden border">
                        <button
                            onClick={() => changeLang("hy")}
                            className={`px-3 py-1 text-xs font-medium leading-none ${
                                i18n.language === "hy"
                                    ? "bg-black text-white"
                                    : "bg-white text-black/70"
                            }`}
                        >
                            {t("lang.hy")}
                        </button>
                        <button
                            onClick={() => changeLang("ru")}
                            className={`px-3 py-1 text-xs font-medium leading-none ${
                                i18n.language === "ru"
                                    ? "bg-black text-white"
                                    : "bg-white text-black/70"
                            }`}
                        >
                            {t("lang.ru")}
                        </button>
                    </div>

                    {/* Phone dropdown */}
                    <div className="relative" ref={panelRef}>
                        <button
                            onClick={() => setShowPhones((p) => !p)}
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Show phones"
                        >
                            <FaPhoneAlt className="text-lg text-black/70" />
                        </button>

                        {showPhones && (
                            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-3 w-44 space-y-2 z-[60]">
                                <a
                                    href="tel:+37460770909"
                                    className="block text-blue-600 hover:underline"
                                >
                                    +374 60 770909
                                </a>
                                <a
                                    href="tel:+37491115566"
                                    className="block text-blue-600 hover:underline"
                                >
                                    +374 91 115566
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
