import { createI18n } from 'vue-i18n'
import am from '@/locales/am.json'
import en from '@/locales/en.json'

const saved = (localStorage.getItem('locale') as 'am' | 'en') || 'am'

// set <html lang="…"> for a11y/SEO
document.documentElement.lang = saved

export const i18n = createI18n({
    legacy: false,
    locale: saved,         // default: Armenian
    fallbackLocale: 'en',
    messages: { am, en },
})

export function setLocale(next: 'am' | 'en') {
    i18n.global.locale.value = next
    localStorage.setItem('locale', next)
    document.documentElement.lang = next
}