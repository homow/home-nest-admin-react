import {cn} from "@utils/ui-utils.ts";

export default function Icon({icon, className, parentClassName}) {
    return (
        <span className={cn("inline-block", parentClassName)}>
            <svg className={cn("size-6", className)}>
                <use href={`#${icon}-icon`}></use>
            </svg>
        </span>
    )
}
