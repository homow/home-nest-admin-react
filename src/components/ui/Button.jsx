import {cn} from "@/lib/utils/ui-utils.js";

export default function Button({text = "ارسال", onClick, type = "button", className = "", disabled = false, hasError = false, ...props}) {
    return (
        <>
            <button
                type={type}
                onClick={onClick}
                className={cn(
                    "w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-700 text-white py-2 rounded-lg transition font-medium cursor-pointer text-sm xs:text-base",
                    disabled && "bg-violet-300dark:bg-violet-900 cursor-not-allowed active:bg-violet-300 dark:hover:bg-violet-900 hover:bg-violet-300 dark:active:bg-violet-900",
                    className,
                    hasError && "animate-shake"
                )}
                {...props}
            >
                {text}
            </button>

            {hasError && (
                <span className={"text-rose-500"}>ارور موجوده، بررسی کن.</span>
            )}
        </>
    );
}
