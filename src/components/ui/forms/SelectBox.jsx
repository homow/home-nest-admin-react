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
                className={cn("absolute font-medium bg-primary-bg p-1 pb-0 -top-3.5 right-3.5 text-sm", open && "text-teal-600", hasError && "text-red-600", disabled && "text-neutral-400")}
            >
                {label}
            </p>

            <button
                type="button"
                onClick={openHandler}
                className={cn(
                    "h-11 flex justify-between text-neutral-500 font-medium items-center w-full rounded-xl border-[0.5px] border-neutral-500 px-4 text-right bg-primary-bg md:h-12",
                    "hover:text-neutral-700 transition-all", open && "text-teal-600 border-teal-600", hasError && "border-red-600", disabled && "text-neutral-300 border-neutral-300 hover:text-neutral-300 cursor-not-allowed"
                )}
            >
                <span>{selectedLabel}</span>
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
                <ul dir={"ltr"} className="min-w-max absolute max-h-96 z-10 w-full mt-2 p-3 pr-1 bg-primary-bg border border-neutral-100 rounded-lg overflow-y-auto select-box-scroll">
                    {options.map(opt => (
                        <li
                            dir={"rtl"}
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                "min-w-max flex items-center gap-4 cursor-pointer px-4 py-3  leading-7 hover:bg-neutral-50 active:bg-neutral-50",
                                value === opt.value && "font-bold bg-neutral-50"
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