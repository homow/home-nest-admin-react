// debounce function
function debounce(callback, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

// format number to string with commas
const formatPriceToString = value => {
    const raw = String(value).replace(/\D/g, "");
    if (!raw) return "";
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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