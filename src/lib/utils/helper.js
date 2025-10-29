// debounce helper
function debounce(callback, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

// number format to str with comma
const priceToStrFormat = value => {
    const raw = String(value).replace(/\D/g, "");
    if (!raw) return "";
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// str format to number without comma
const priceFromStrFormat = value => {
    if (typeof value !== 'string') return value;
    const raw = value.replace(/,/g, '').trim();
    return raw === '' ? null : Number(raw);
};

// format number
const priceToStrFormatDebounce = debounce((input, callback, name) => {
    const value = priceToStrFormat(input.target.value);
    callback(name, value)
}, 300);

const buildObjectFromArray = data => {
    return data.reduce((acc, item) => {
        const [key, value] = item.split("=");
        return {...acc, [key.trim()]: value.trim()};
    }, {})
}

export {priceToStrFormatDebounce, priceFromStrFormat, buildObjectFromArray};