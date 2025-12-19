import type {Dispatch, SetStateAction} from "react";
import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

const cn: (...inputs: ClassValue[]) => string = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface ApplyCustomSpaceProps {
    setCurrentCollapsed: Dispatch<SetStateAction<boolean>>;
    collapsed: boolean;
}

function applyCustomSpace(
    {
        setCurrentCollapsed,
        collapsed
    }: ApplyCustomSpaceProps
): void {
    if (window.innerWidth < 896) {
        document.documentElement.style.setProperty("--spacing-custom", "0px");
        setCurrentCollapsed(false);
    } else {
        document.documentElement.style.setProperty(
            "--spacing-custom",
            collapsed ? "80px" : "256px"
        );
        setCurrentCollapsed(collapsed);
    }
}

function getCollapsedMeniInStorage(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("collapsedMenu") === "true";
}

export {cn, applyCustomSpace, getCollapsedMeniInStorage};
