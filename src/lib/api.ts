// src/lib/api.ts
import axios from "axios";
import i18next from "i18next";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE ?? "",
    withCredentials: true,
    headers: { Accept: "application/json" },
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
});

export async function initCsrf() {
    await api.get("/csrf-cookie");
}

export async function postWithCsrf(url: string, data: any) {
    return api.post(url, data, {
        headers: {
            "X-Locale": i18next.language || localStorage.getItem("lang") || "hy",
            "Accept-Language": i18next.language || "hy",
        },
    });
}

export default api;
