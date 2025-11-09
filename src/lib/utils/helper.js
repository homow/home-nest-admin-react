// debounce function
function debounce(callback, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

// convert persian numbers to english
function normalizeDigits(str) {
    return str
        .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
        .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

// format number to string with commas
const formatPriceToString = value => {
    const normalized = normalizeDigits(String(value));
    const number = Number(normalized.replace(/\D/g, ""));
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(number);
};

// convert formatted string to number
const parsePriceFromString = value => {
    if (typeof value !== "string") return value;
    const raw = value.replace(/,/g, "").trim();
    return raw === "" ? null : Number(raw);
};

// debounce wrapper for price formatting
const formatPriceDebounced = debounce((input, callback, name) => {
    const value = formatPriceToString(input.target.value);
    callback(name, value);
}, 300);

// convert array of "key = value" strings to object
const buildObjectFromKeyValueArray = data => {
    return data.reduce((acc, item) => {
        const [key, value] = item.split("=");
        if (!key.trim() || !value.trim()) return acc;
        acc[key.trim()] = value.trim();
        return acc;
    }, {});
};

export {
    formatPriceDebounced,
    parsePriceFromString,
    buildObjectFromKeyValueArray
};