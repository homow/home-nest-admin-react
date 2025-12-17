import {useState, useRef, useEffect} from "react";
import {cn} from "@utils/ui-utils.ts";
import Icon from "@components/ui/icons/Icon.jsx";

export default function SelectBox({label, options, value, onChange, className, helperText, hasError, disabled}) {
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const optionRefs = useRef([]);

    // choose option with arrow keys
    const keyHandler = e => {
        if (!open) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
                setFocusedIndex(options.findIndex(o => o.value === value));
            }
            return;
        }

        if (e.key === "Escape") {
            setOpen(false);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex(prev => (prev + 1) % options.length);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex(prev => (prev - 1 + options.length) % options.length);
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (focusedIndex >= 0) {
                onChange(options[focusedIndex].value);
                setOpen(false);
            }
        }
    };

    // open handler
    const openHandler = () => {
        if (!open && disabled) {
            return;
        }

        setOpen(!open);
    }

    //
    useEffect(() => {
        optionRefs.current = optionRefs.current.slice(0, options.length);
    }, [options]);

    // scroll box by arrow key
    useEffect(() => {
        if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
            optionRefs.current[focusedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [focusedIndex]);

    // clear focus when closes box
    useEffect(() => {
        setFocusedIndex(-1)
    }, [open])

    // close box when click the outside
    useEffect(() => {
        const handleClickOutside = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
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
        <div
            ref={wrapperRef}
            className={cn("relative w-full", className)}
        >
            <p
                className={cn("font-medium mb-1 -top-3.5 right-3.5 text-sm", disabled && "text-neutral-400")}
            >
                {label}
            </p>

            <button
                type="button"
                onClick={openHandler}
                onKeyDown={keyHandler}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls="select-options"
                className={cn(
                    "flex justify-between text-neutral-500 font-medium items-center w-full rounded-lg border border-gray-300 outline-none px-4 py-2 text-right bg-primary-bg/40 focus:border-violet-500 focus-visible:ring-1 focus:ring-violet-500",
                    "hover:text-neutral-700 transition-all", open && "ring-1 ring-violet-500 border-violet-500 rounded-b-none"
                )}
            >
                <span className={"text-secondary-txt"}>{selectedLabel}</span>
                <Icon icon={"chevronDown"} className={cn("text-secondary-txt size-4 transition-transform", open && "rotate-180")}/>
            </button>

            {!open &&
                <span
                    className={cn("absolute pr-4 pt-2 text-sm text-neutral-600", hasError && "text-red-600!", disabled && "text-neutral-400")}
                >
                    {helperText}
                </span>
            }

            {(open && !disabled) && (
                <ul
                    id="select-options"
                    role="listbox"
                    tabIndex={-1}
                    dir={"ltr"}
                    className="select-box-scroll min-w-max absolute max-h-96 z-20 w-full mt-2 p-1 bg-primary-bg border border-violet-500 overflow-y-auto space-y-0.5"
                >
                    {options.map((opt, index) => (
                        <li
                            id={`option-${index}`}
                            role="option"
                            aria-selected={value === opt.value}
                            ref={el => {
                                optionRefs.current[index] = el
                            }}
                            tabIndex={-1}
                            onKeyDown={keyHandler}
                            dir={"rtl"}
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                "min-w-max flex flex-row items-center justify-between text-sm gap-4 cursor-pointer px-4 py-1.5 leading-7 hover:bg-black/30 dark:hover:bg-white/10",
                                value === opt.value && "font-bold bg-violet-500/40", focusedIndex === index && "bg-black/30 dark:bg-white/10"
                            )}
                        >
                            <span className={"flex items-center gap-2"}>
                                {opt.icon && <Icon className={"text-violet-600"} icon={opt.icon}/>
                                }
                                {opt.label}
                            </span>
                            {value === opt.value && <Icon
                                className={"size-5"} icon={"tick"}/>
                            }
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};