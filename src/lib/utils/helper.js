// debounce helper
function debounce(callback, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

// format to price with comma
const priceToStrFormat = value => {
    const raw = String(value).replace(/\D/g, "");
    if (!raw) return "";
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// format number
const priceToStrFormatDebounce = debounce((input, callback, name) => {
    const value = priceToStrFormat(input.target.value);
    callback(name, value)
}, 300);

export {priceToStrFormatDebounce};