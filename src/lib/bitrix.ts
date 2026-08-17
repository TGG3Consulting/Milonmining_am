const BITRIX_WEBHOOK =
    (import.meta.env.VITE_BITRIX_WEBHOOK as string | undefined)?.replace(/\/+$/, "") ||
    "https://milonmining24.bitrix24.ru/rest/1/bz14lw3po9hzih5f";

const DEAL_CATEGORY_ID = 5;
const DEAL_STAGE_ID = "C5:UC_UX02IR";
const DEAL_SOURCE_ID = "UC_3SM87Y";
const DEAL_SITE_ID_FIELD = "UF_CRM_1776278278898";

type ReserveKind = "apartments" | "houses";

type SendBitrixReserveParams = {
    kind: ReserveKind;
    relationId: number | string;
    name: string;
    phone: string;
    locale?: string;
    requestType?: "reserve" | "callback";
    unitSummary?: string;
    apartmentNumber?: string | number | null;
    floor?: string | number | null;
    squareMeter?: string | number | null;
};

type BitrixAddResponse = {
    result?: number;
    error?: string;
    error_description?: string;
};

function splitFullName(value: string) {
    const normalizedName = value.trim();
    const [firstName, ...lastNameParts] = normalizedName.split(/\s+/).filter(Boolean);

    return {
        firstName: firstName || normalizedName,
        lastName: lastNameParts.join(" "),
    };
}

async function postBitrix(method: string, form: URLSearchParams): Promise<BitrixAddResponse> {
    const response = await fetch(`${BITRIX_WEBHOOK}/${method}.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: form.toString(),
    });

    if (!response.ok) {
        throw new Error(`Bitrix ${method} failed with status ${response.status}`);
    }

    const data = (await response.json()) as BitrixAddResponse;
    if (data?.error) {
        throw new Error(data.error_description || data.error || `Bitrix ${method} failed`);
    }

    return data;
}

export async function sendBitrixReserve({
    kind,
    relationId,
    name,
    phone,
    locale,
    requestType = "reserve",
    unitSummary,
    apartmentNumber,
    floor,
    squareMeter,
}: SendBitrixReserveParams): Promise<void> {
    if (!BITRIX_WEBHOOK) return;

    const isApartment = kind === "apartments";
    const normalizedPhone = phone.trim();
    const numericPhone = normalizedPhone.replace(/\D/g, "");
    const normalizedRelationId = String(relationId);
    const normalizedLocale = locale === "hy" ? "am" : (locale || "am");
    const { firstName, lastName } = splitFullName(name);

    const normalizedApartmentNumber = apartmentNumber == null || apartmentNumber === "" ? normalizedRelationId : String(apartmentNumber);
    const normalizedFloor = floor == null ? "" : String(floor);
    const normalizedSquareMeter = squareMeter == null ? "" : String(squareMeter);
    const titleUnit = isApartment ? `apartment #${normalizedApartmentNumber}` : `house #${normalizedRelationId}`;
    const commentParts = [
        unitSummary,
        isApartment && normalizedSquareMeter ? `Square meter: ${normalizedSquareMeter}` : null,
        isApartment && normalizedFloor ? `Floor: ${normalizedFloor}` : null,
        `Locale: ${normalizedLocale}`,
        `Type: ${requestType}`,
        `Source: landing`,
    ].filter(Boolean);

    const contactForm = new URLSearchParams();
    contactForm.set("fields[NAME]", firstName);
    contactForm.set("fields[LAST_NAME]", lastName);
    if (numericPhone) {
        contactForm.set("fields[PHONE][0][VALUE]", numericPhone);
        contactForm.set("fields[PHONE][0][VALUE_TYPE]", "WORK");
    }
    contactForm.set("fields[SOURCE_ID]", DEAL_SOURCE_ID);

    const contact = await postBitrix("crm.contact.add", contactForm);
    const contactId = contact.result;

    if (!contactId) {
        throw new Error("Bitrix contact add did not return an id");
    }

    const dealForm = new URLSearchParams();
    dealForm.set("fields[TITLE]", `${requestType === "callback" ? "Callback" : "Reserve"} ${titleUnit}`);
    dealForm.set("fields[CATEGORY_ID]", String(DEAL_CATEGORY_ID));
    dealForm.set("fields[STAGE_ID]", DEAL_STAGE_ID);
    dealForm.set("fields[SOURCE_ID]", DEAL_SOURCE_ID);
    dealForm.set("fields[CONTACT_ID]", String(contactId));
    dealForm.set(`fields[${DEAL_SITE_ID_FIELD}]`, normalizedRelationId);
    dealForm.set("fields[COMMENTS]", commentParts.join("\n"));

    await postBitrix("crm.deal.add", dealForm);
}
