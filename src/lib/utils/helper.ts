// debounce function
function debounce<T extends unknown[]>(
    callback: (...args: T) => void,
    delay = 300
) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: T) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

// convert persian numbers to english
function normalizeDigits(str: string): string {
    return str
        .replace(/[۰-۹]/g, (d: string) =>
            String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
        )
        .replace(/[٠-٩]/g, (d: string) =>
            String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
        );
}

// format number to string with commas
function formatPriceToString(value: number | string): string {
    const normalized: string = normalizeDigits(String(value));
    const number: number = Number(normalized.replace(/\D/g, ""));
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(number);
}

// convert formatted string to number
function parsePriceFromString(value: string): number | null {
    const raw: string = value.replace(/,/g, "").trim();
    return raw === "" ? null : Number(raw);
}

// debounce wrapper for price formatting
function formatPriceDebouncedCB(
    input: string,
    name: string,
    callback: (name: string, value: string) => void
) {
    const value: string = normalizeDigits(input);
    callback(name, value);
}

const formatPriceDebounced: (
    input: string,
    name: string,
    callback: (name: string, value: string) => void
) => void = debounce(formatPriceDebouncedCB);

// convert array of "key = value" strings to object
function buildObjectFromKeyValueArray(
    data: string[]
): Record<string, string> {
    return data.reduce<Record<string, string>>(
        (acc, item) => {
            const [key, value] = item.split("=");
            if (!key.trim() || !value.trim()) return acc;
            acc[key.trim()] = value.trim();
            return acc;
        }, {} as Record<string, string>
    );
}

export {
    formatPriceDebounced,
    parsePriceFromString,
    buildObjectFromKeyValueArray,
    formatPriceToString
};