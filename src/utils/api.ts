import axios from 'axios'
import { useAuth } from '@/stores/auth'
import router from '@/router'
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// attach token
api.interceptors.request.use((config) => {
    const auth = useAuth()
    if (auth?.token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${auth.token}`
    }
    // add language header from localStorage (defaults to Armenian)
    const locale = localStorage.getItem('locale') || 'am'
    config.headers = config.headers ?? {}
    config.headers['Accept-Language'] = locale
    return config
})
const toast = useToast();

async function extractApiMessage(err: any): Promise<string | undefined> {
    const data = err?.response?.data.message;
    if (!data) return undefined;

    // If backend sent plain string
    if (typeof data === "string") return data;

    // If backend sent Blob (e.g., Laravel sometimes on errors)
    if (data instanceof Blob) {
        try {
            const text = await data.text();
            try {
                const json = JSON.parse(text);
                return json?.message || json?.error || text;
            } catch {
                return text;
            }
        } catch {
            return undefined;
        }
    }

    // Typical JSON { message: "...", errors: {...} }
    return data.message || data.error;
}
// 401 handling
api.interceptors.response.use(
    (r) => r,
    async (err) => {
        const status = err?.response?.status;

        // keep your existing 401 flow
        if (status === 401) {
            const auth = useAuth();
            auth.$reset();
            if (router.currentRoute.value.path !== "/login") {
                router.replace({
                    path: "/login",
                    query: { next: router.currentRoute.value.fullPath },
                });
            }
            return Promise.reject(err);
        }

        // show translated message only for 500 OR when no message is available
        const apiMessage = await extractApiMessage(err);
        if (status === 500 || !apiMessage) {
            toast.error(i18n.global.t("errors.500"));
        } else {
            toast.error(apiMessage);
        }

        return Promise.reject(err);
    }
);

export default api