async function handleApiResponse(res) {
    let data;
    try {
        data = await res.json();
    } catch {
        throw {
            status: res.status,
            message: "پاسخ نامعتبر از سرور دریافت شد.",
            raw: res,
        };
    }

    if (!res.ok) {
        throw {
            res,
            status: res.status,
            message: data?.error?.code || data?.error?.name || "خطای ناشناخته از سرور.",
            data,
        };
    }
    return data;
}

export {handleApiResponse}