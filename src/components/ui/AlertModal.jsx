import {useEffect, useState} from "react";

export default function AlertModal({message, isOpen, type = "error"}) {
    const [open, setOpen] = useState(false);

    const bgHeader = type === "error" ? "text-red-500" : "text-green-500";
    const btnBg = type === "error" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600";
    const title = type === "error" ? "خطا" : "موفقیت";

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    return (
        <div className={`fixed top-6 right-0 left-0 flex items-center justify-center shadow-custom z-30 ${open ? "block" : "hidden"}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
                <h3 className={`text-lg font-semibold ${bgHeader}`}>
                    {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{message}</p>
                <div className="flex justify-end">
                    <button
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
