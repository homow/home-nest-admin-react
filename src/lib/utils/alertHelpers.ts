export type AlertType = "success" | "error" | "info" | "warning";

export function getBgHeader(alertType: AlertType): string {
    const map = {
        error: "text-rose-500",
        success: "text-emerald-500",
        warning: "text-amber-500",
        info: "text-sky-500"
    };
    return map[alertType] || "text-gray-500 dark:text-gray-300";
}

export function getBtnBg(alertType: AlertType): string {
    const map = {
        error: "bg-rose-500 hover:bg-rose-600",
        success: "bg-emerald-500 hover:bg-emerald-600",
        warning: "bg-amber-500 hover:bg-amber-600",
        info: "bg-sky-500 hover:bg-sky-600"
    };
    return map[alertType] || "bg-gray-500 hover:bg-gray-600";
}

export function getTitle(alertType: AlertType): string {
    const map = {
        error: "خطا",
        success: "موفقیت",
        warning: "هشدار",
        info: "اطلاع"
    };
    return map[alertType] || "پیام";
}

export function getBgBar(alertType: AlertType): string {
    const map = {
        error: "bg-rose-500",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        info: "bg-sky-500"
    };
    return map[alertType] || "bg-gray-500";
}