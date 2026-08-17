import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    const { t } = useTranslation();

    const phones = (t("company.phones", { returnObjects: true }) as string[]) || [];
    const instagram = t("social.instagram") as string;
    const facebook = t("social.facebook") as string;

    return (
        <footer className="mt-14 bg-slate-900 text-slate-100">
            <div className="max-w-6xl mx-auto px-4 py-10 grid gap-10 md:grid-cols-2">
                {/* ՏՎՅԱԼՆԵՐ */}
                <div>
                    <h3 className="text-xs tracking-[0.18em] text-slate-300 font-semibold">
                        {t("footer.infoTitle")}
                    </h3>
                    <div className="mt-4 space-y-1.5 text-sm">
                        <div className="font-semibold">{t("company.legalName")}</div>
                        <div>{t("company.director")}</div>
                        <div>
                            {t("company.tinLabel")} {t("company.tin")}
                        </div>
                        <div>
                            {t("company.accountLabel")} {t("company.account")}
                        </div>
                        <div>{t("company.bankName")}</div>
                        <div>
                            <Link
                                to="/voroshumner"
                                className="hover:text-white underline-offset-2 hover:underline"
                            >
                                {t("nav.decisions")}
                            </Link>
                        </div>
                        <div>{t("company.address")}</div>
                    </div>
                </div>

                {/* ԿՈՆՏԱԿՏՆԵՐ */}
                <div>
                    <h3 className="text-xs tracking-[0.18em] text-slate-300 font-semibold">
                        {t("footer.contactsTitle")}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex flex-col gap-1.5">
                            {phones.map((p) => (
                                <a
                                    key={p}
                                    href={`tel:${p.replace(/[^+\d]/g, "")}`}
                                    className="inline-flex items-center gap-2 hover:text-white"
                                >
                                    <FaPhoneAlt className="opacity-70" />
                                    <span>{p}</span>
                                </a>
                            ))}
                        </div>

                        <a
                            href={`mailto:${t("company.email")}`}
                            className="inline-flex items-center gap-2 hover:text-white"
                        >
                            <FaEnvelope className="opacity-70" />
                            <span>{t("company.email")}</span>
                        </a>

                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href={instagram}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href={facebook}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20"
                            >
                                <FaFacebookF />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* bottom bar */}
            <div className="border-t border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-400 flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} {t("brandName", "Milon Mining")}
          </span>
                    <span>{t("footer.rights")}</span>
                </div>
            </div>
        </footer>
    );
}
