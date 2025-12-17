import {cn} from "@utils/ui-utils";
import type {PropsStyle} from "@/types/button.types";

export default function buttonStyle(
    {
        btnStyle,
        className,
        loading,
        disabled
    }: PropsStyle
): string {
    const outlineStyle = "border border-violet-600 text-violet-600 focus-visible:border-violet-700 focus-visible:text-violet-900";
    const segmentedStyle = "hover:border-violet-500 active:bg-violet-600 active:border-violet-600 active:text-white disabled:border-neutral-300 disabled:text-neutral-500";

    const buttonStyle: string = {
        fill: "bg-violet-600 text-white rounded-lg hover:bg-violet-700 active:bg-violet-900 disabled:bg-neutral-200 disabled:text-neutral-400 focus-visible:bg-violet-700",
        outline: `${outlineStyle} rounded-lg hover:border-violet-700 active:text-violet-900 active:border-violet-900 disabled:text-neutral-300 disabled:border-neutral-50`,
        sharpL: `${outlineStyle} ${segmentedStyle} rounded-r-lg`,
        sharpR: `${outlineStyle} ${segmentedStyle} rounded-l-lg`,
        sharpBoth: `${outlineStyle} ${segmentedStyle}`,
        sharpNone: `${outlineStyle} ${segmentedStyle} rounded-lg`,
        primary: "text-violet-600 hover:border-violet-700 active:text-violet-900 disabled:text-neutral-300 focus-visible:text-violet-700"
    }[btnStyle];

    return cn("flex items-center gap-2 h-10 text-center font-medium px-4 py-1.5 cursor-pointer transition-all outline-none md:py-2 md:h-11 xl:text-xl/7 xl:h-12", buttonStyle, className, (loading || disabled) && "cursor-not-allowed");
};