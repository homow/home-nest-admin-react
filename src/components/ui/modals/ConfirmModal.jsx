import {useEffect, useRef} from "react";
import {cn} from "@/lib/utils/ui-utils.js";

export default function ConfirmModal({isOpen, message, title = "تأیید", onConfirm, onCancel, confirmText = "تأیید", cancelText = "لغو", dangerMode = false, z = "z-30",}) {
    const confirmRef = useRef(null);
    const dialogRef = useRef(null);

    const confirmBtnBg = dangerMode
        ? "bg-rose-600 hover:bg-rose-800"
        : "bg-emerald-600 hover:bg-emerald-800";

    const cancelBtnBg = dangerMode
        ? "bg-emerald-600 hover:bg-emerald-800"
        : "bg-rose-600 hover:bg-rose-800";

    const modalHeaderColor = dangerMode ? "text-rose-500" : "text-emerald-500";

    // Focus trapping (prevent tabbing outside modal)
    useEffect(() => {
        if (!isOpen) return;
        confirmRef.current?.focus();

        const focusableElements =
            dialogRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) || [];

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        const handleTab = (event) => {
            if (event.key === "Tab") {
                if (event.shiftKey && document.activeElement === firstEl) {
                    event.preventDefault();
                    lastEl.focus();
                } else if (!event.shiftKey && document.activeElement === lastEl) {
                    event.preventDefault();
                    firstEl.focus();
                }
            } else if (event.key === "Escape") {
                onCancel();
            }
        };

        document.addEventListener("keydown", handleTab);
        return () => document.removeEventListener("keydown", handleTab);
    }, [isOpen, onCancel]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-message"
            className={cn(
                `fixed inset-0 flex items-center justify-center ${z} ${
                    isOpen ? "block" : "hidden"
                }`
            )}
        >
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                aria-hidden="true"
                onClick={onCancel}
            ></div>

            {/* dialog content */}
            <div
                ref={dialogRef}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 z-10"
            >
                <h3
                    id="modal-title"
                    className={cn(`text-lg font-medium ${modalHeaderColor}`)}
                >
                    {title}
                </h3>
                <p
                    id="modal-message"
                    className="text-gray-700 dark:text-gray-300"
                >
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        ref={confirmRef}
                        onClick={() => onConfirm?.()}
                        className={cn(
                            "cursor-pointer px-4 py-1.5 rounded-lg text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black focus:ring-offset-white hover:brightness-110",
                            confirmBtnBg
                        )}
                    >
                        {confirmText}
                    </button>

                    <button
                        onClick={onCancel}
                        className={cn(
                            "cursor-pointer px-4 py-1.5 rounded-lg text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black focus:ring-offset-white",
                            cancelBtnBg
                        )}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
