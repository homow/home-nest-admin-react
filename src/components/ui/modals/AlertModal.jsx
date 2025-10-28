import {useEffect, useRef} from "react";
import {cn} from "@/lib/utils/ui-utils.js";

export default function AlertModal({message = "", type = "error", isOpen = false, setIsOpen, setData, closeDelay = 5000}) {
    const buttonRef = useRef(null);
    const alertRef = useRef(null);

    const bgHeader = type === "error" ? "text-rose-500" : "text-emerald-500";
    const btnBg = type === "error" ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600";
    const title = type === "error" ? "خطا" : "موفقیت";

    useEffect(() => {
        // ESC key listener
        if (isOpen && buttonRef.current) buttonRef.current.focus();

        const handleKey = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKey);
        }

        // cleanUp Event
        return () => {
            window.removeEventListener("keydown", handleKey);
        }
    }, [isOpen, setIsOpen]);
    
    useEffect(() => {
        if (isOpen) {
            if (alertRef.current) clearTimeout(alertRef.current);
            
            alertRef.current = setTimeout(() => {
                setIsOpen(false);
                setData({type: null, message: ""});
            }, closeDelay);
        }
        
        return () => {
            if (alertRef.current) clearTimeout(alertRef.current);
        }
    }, [closeDelay, isOpen, setData, setIsOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={cn(`text-sm fixed px-4 top-6 left-1/2 max-w-md w-full -translate-x-1/2 flex items-center justify-center shadow-custom z-30 sm:text-base ${isOpen ? "block" : "hidden"}`)}
            role={"alertdialog"}
            aria-live={"assertive"}
            aria-modal={true}
            aria-labelledby={"alert-title"}
            aria-describedby={"alert-desc"}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full p-6 space-y-4">
                <h3 className={`text-lg font-semibold ${bgHeader}`}>
                    {title}
                </h3>
                <p
                    className="text-gray-700 dark:text-gray-300"
                    aria-live={"assertive"}
                >
                    {message}
                </p>
                <div className="flex justify-end">
                    <button
                        ref={buttonRef}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            `cursor-pointer px-3 py-1 rounded-lg text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black focus:ring-offset-white hover:brightness-110`,
                            btnBg
                        )}
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
}
