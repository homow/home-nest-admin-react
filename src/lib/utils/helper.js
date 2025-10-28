// format to price with comma
const formatToPrice = value => {
    const raw = String(value).replace(/\D/g, "");
    if (!raw) return "";
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// debounce helper
function debounce(callback, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

// format number
const handlePriceInput = debounce((input) => {
    const value = input.value.trim();
    input.value = formatToPrice(value);
}, 400);

export {formatToPrice, handlePriceInput};