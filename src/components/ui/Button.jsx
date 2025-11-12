import {cn} from "@utils/ui-utils.js";

const LoadingSpinner = () => (
    <span className="animate-spin h-3.5 inline-block">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3.5 h-3.5"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
  </span>
);

export default function Button({text = "ارسال", onClick, type = "button", className = "", disabled = false, hasError = false, loading, ...props}) {
    return (
        <>
            <button
                type={type}
                onClick={onClick}
                className={cn(
                    "w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-700 text-white py-2 rounded-lg transition font-medium cursor-pointer text-sm xs:text-base",
                    disabled && "bg-violet-300 dark:bg-violet-900 cursor-not-allowed active:bg-violet-300 dark:hover:bg-violet-900 hover:bg-violet-300 dark:active:bg-violet-900",
                    className,
                    hasError && "animate-shake"
                )}
                {...props}
            >
                {loading ?
                    <LoadingSpinner/> :
                    text
                }
            </button>

            {hasError && (
                <span className={"text-rose-500"}>ارور موجوده، بررسی کن.</span>
            )}
        </>
    );
}
