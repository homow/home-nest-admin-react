const setErrorInCreateProperty = error => {
    const rawError = error.response;

    if (rawError.data.detail.includes(
        "duplicate key value violates unique constraint \"idx_properties_property_number_unique\"")) {
        return "شناسه ملک تکراریه، یکی دیگه وارد کن.";
    }
}

export {setErrorInCreateProperty}