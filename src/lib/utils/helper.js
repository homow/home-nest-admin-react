const formatToPrice = value => {
    const raw = String(value).replace(/\D/g, "");
    if (!raw) return "";
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export {formatToPrice}