import {useEffect, useState, useRef} from "react";
import {cn} from "@/lib/utils/ui-utils.js";

export default function AlertModal({message, isOpen, type = "error"}) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);

    const bgHeader = type === "error" ? "text-rose-500" : "text-emerald-500";
    const btnBg = type === "error" ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600";
    const title = type === "error" ? "خطا" : "موفقیت";

    useEffect(() => {
        setOpen(isOpen);

        // focus on close Button
        if (isOpen && buttonRef?.current) buttonRef?.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        const handleKey = e => {
            if (e.key === "Escape") setOpen(false);
        };

        if (open) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open]);

    return (
        <div
            className={cn(`text-sm fixed px-4 top-6 left-1/2 max-w-md w-full -translate-x-1/2 flex items-center justify-center shadow-custom z-30 sm:text-base ${open ? "block" : "hidden"}`)}
            role={type === "error" ? "alert" : "status"}
            aria-live={"assertive"}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full p-6 space-y-4">
                <h3 className={`text-lg font-semibold ${bgHeader}`}>
                    {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{message}</p>
                <div className="flex justify-end">
                    <button
                        ref={buttonRef}
                        onClick={() => setOpen(false)}
                        className={`cursor-pointer px-3 py-1 rounded-lg text-white ${btnBg} transition`}
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
}
