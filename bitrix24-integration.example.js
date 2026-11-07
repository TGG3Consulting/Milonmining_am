/**
 * Load this file before site.js after the backend endpoint is ready.
 * Never expose a Bitrix24 webhook secret directly in frontend code.
 */
window.MILON_CONFIG = {
  leadEndpoint: "https://your-domain.example/api/milon-leads"
};

/**
 * JSON payload sent by site.js:
 * {
 *   name: string,
 *   phone: string,
 *   preferred_contact_method: "call" | "whatsapp" | "viber" | "telegram",
 *   project: string | null,
 *   apartment_id: string | null,
 *   source_page: string,
 *   language: "hy" | "ru",
 *   consent: true,
 *   created_at: ISODateString
 * }
 */
