import {useState, useRef, useEffect} from "react";
import {cn} from "@/lib/utils/ui-utils.js";
import Icon from "@components/ui/icons/Icon.jsx";

export default function SelectBox({label, options, value, onChange, className, helperText, hasError, disabled}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const openHandler = () => {
        if (!open && disabled) {
            return;
        }

        setOpen(!open);
    }

    useEffect(() => {
        const handleClickOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || "انتخاب کنید";

    return (
        <div ref={ref} className={cn("relative w-full", className)}>
            <p
                className={cn("font-medium mb-1 -top-3.5 right-3.5 text-sm", disabled && "text-neutral-400")}
            >
                {label}
            </p>

            <button
                type="button"
                onClick={openHandler}
                className={cn(
                    "flex justify-between text-neutral-500 font-medium items-center w-full rounded-lg border-[0.5px] border-gray-300 px-4 py-2 text-right bg-primary-bg/40",
                    "hover:text-neutral-700 transition-all", open && "border-violet-500", hasError && "border-red-600", disabled && "text-neutral-300 border-neutral-300 hover:text-neutral-300 cursor-not-allowed"
                )}
            >
                <span className={"text-secondary-txt"}>{selectedLabel}</span>
                <Icon id={"chevronDown"} className={cn("size-2.5 transition-transform", open && "rotate-180")}/>
            </button>

            {!open &&
                <span
                    className={cn("absolute pr-4 pt-2 text-sm text-neutral-600", hasError && "text-red-600!", disabled && "text-neutral-400")}
                >
                    {helperText}
                </span>
            }

            {(open && !disabled) && (
                <ul dir={"ltr"} className="min-w-max absolute max-h-96 z-10 w-full mt-2 p-3 pr-1 bg-primary-bg border border-violet-500 rounded-lg overflow-y-auto select-box-scroll">
                    {options.map(opt => (
                        <li
                            dir={"rtl"}
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                "min-w-max text-sm flex items-center gap-4 cursor-pointer px-4 py-2  leading-7 hover:bg-white/10 active:bg-neutral-50",
                                value === opt.value && "font-bold bg-white/10"
                            )}
                        >
                            {opt.icon && <Icon className={"text-teal-600"} id={opt.icon}/>}
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};