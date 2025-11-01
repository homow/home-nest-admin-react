import {useEffect, useRef, useState} from "react";
import {cn} from "@utils/ui-utils.js";

export default function AlertModal({message = "", type, isOpen = false, setIsOpen, setData, closeDelay = 5000}) {
    const [barWidth, setBarWidth] = useState(100)
    const buttonRef = useRef(null);
    const alertRef = useRef(null);

    const bgHeader = {
        error: "text-rose-500",
        success: "text-emerald-500",
        warning: "text-amber-500",
        info: "text-sky-500"
    }[type] || "text-gray-500 dark:text-gray-300";

    const btnBg = {
        error: "bg-rose-500 hover:bg-rose-600",
        success: "bg-emerald-500 hover:bg-emerald-600",
        warning: "bg-amber-500 hover:bg-amber-600",
        info: "bg-sky-500 hover:bg-sky-600"
    }[type] || "bg-gray-500 hover:bg-gray-600";

    const title = {
        error: "خطا",
        success: "موفقیت",
        warning: "هشدار",
        info: "اطلاع"
    }[type] || "پیام";

    const bgBar = {
        error: "bg-rose-500",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        info: "bg-sky-500"
    }[type] || "bg-gray-500";

    // close with Escape
    useEffect(() => {
        // ESC key listener
        if (isOpen && buttonRef.current) buttonRef.current.focus();

        const handleKey = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        if (isOpen) window.addEventListener("keydown", handleKey);

        // cleanUp Event
        return () => {
            window.removeEventListener("keydown", handleKey);
        }
    }, [isOpen, setIsOpen]);

    // auto close after many seconds
    useEffect(() => {
        if (isOpen) {
            // cleanUp timeOut (if exist)
            if (alertRef.current) clearTimeout(alertRef.current);

            // add new timer
            alertRef.current = setTimeout(() => {
                setIsOpen(false);
                setData && setData({type: null, message: ""});
            }, closeDelay);
        }

        // cleanUp timeOut
        return () => {
            if (alertRef.current) clearTimeout(alertRef.current);
        }
    }, [closeDelay, isOpen, setData, setIsOpen]);

    // progress bar
    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / closeDelay, 1);
            setBarWidth(100 - progress * 100);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        if (isOpen) {
            setBarWidth(100);
            animationFrame = requestAnimationFrame(animate);
        }

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [isOpen, closeDelay]);

    if (!isOpen) return null;

    return (
        <div
            className={cn("max-w-70 text-sm fixed top-3 right-3 w-full flex items-center overflow-hidden justify-center shadow-2xl z-30 xs:max-w-xs sm:text-base sm:max-w-sm", isOpen ? "block" : "hidden")}
            role={"alertdialog"}
            aria-live={"assertive"}
            aria-modal={true}
            aria-labelledby={"alert-title"}
            aria-describedby={"alert-desc"}
        >
            <div className="bg-white dark:bg-gray-800 shadow-xl w-full space-y-2 pt-3">
                <h3 className={cn("px-3 text-lg font-semibold", bgHeader)}>
                    {title}
                </h3>
                <p
                    className="max-w-max text-gray-700 px-3 dark:text-gray-300"
                    aria-live={"assertive"}
                >
                    {message}
                </p>
                <div className="flex justify-end px-3">
                    <button
                        ref={buttonRef}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "cursor-pointer px-3 py-1 text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black focus:ring-offset-white hover:brightness-110",
                            btnBg
                        )}
                    >
                        بستن
                    </button>
                </div>

                <div dir={"ltr"} className={"mt-3"}>
                    <div
                        style={{width: `${barWidth}%`, transformOrigin: "left"}}
                        className={cn("h-2", bgBar)}
                    ></div>
                </div>
            </div>
        </div>
    );
}
