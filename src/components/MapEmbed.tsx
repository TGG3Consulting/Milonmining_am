import {useTranslation} from "react-i18next";

export default function MapEmbed() {
    const {t, i18n} = useTranslation();

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: 400,
                borderRadius: 12,       // մնա արտաքին ձևի համար
                // overflow: "hidden",   // ❌ հանում ենք, որ controls-ը չկտրվի
            }}
        >
            <iframe
                title="Milon Mining"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905.4354933250208!2d44.57502854937896!3d40.242199257676056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406aa3d2ea3ce4fd%3A0xef35661f5f4d3f07!2zTUlMT04gTWluaW5nIENvbXBhbnkg1YfVq9W21aHVttW11bjWgtWp1asg1LLVodWm1aE!5e0!3m2!1sru!2sam!4v1678694526903!5m2!1sru!2sam"
                width="100%"
                height="100%"
                style={{
                    border: 0,
                    borderRadius: 12,     // ✅ կլոր անկյուններ՝ առանց clipping-ի
                    display: "block",
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                // allowFullScreen   // ըստ ցանկության
            />

            {/* Static address box */}
            <div
                style={{
                    position: "absolute",
                    left: 12,
                    bottom: 12,
                    background: "white",
                    padding: "10px 12px",
                    borderRadius: 10,
                    boxShadow: "0 6px 20px rgba(0,0,0,.15)",
                }}
            >
                <strong>Milon mining</strong>
                <div>{t("about.address")}</div>
            </div>
        </div>
    );
}
