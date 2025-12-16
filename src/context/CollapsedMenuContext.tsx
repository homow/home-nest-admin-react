import type {Context, Dispatch, SetStateAction} from "react";
import type {ChildrenProps} from "@/types/common.types";
import {use, createContext, useState, useEffect, useEffectEvent} from "react";
import {applyCustomSpace, getCollapsedMeniInStorage} from "@utils/ui-utils";

interface ValueProps {
    collapsed: boolean;
    setCollapsed: Dispatch<SetStateAction<boolean>>;
    currentCollapsed: boolean;
}

const CollapsedMenuContext: Context<ValueProps | null> = createContext<ValueProps | null>(null);

function CollapsedMenuProvider({children}: ChildrenProps) {
    const [collapsed, setCollapsed] = useState<boolean>(getCollapsedMeniInStorage);
    const [currentCollapsed, setCurrentCollapsed] = useState<boolean>(false);

    const handleResize: () => void = useEffectEvent(() => {
        applyCustomSpace({setCurrentCollapsed, collapsed});
    });

    // apply margin-right custom and collapsed
    useEffect(() => {
        window.addEventListener("resize", handleResize);

        // cleanUp event
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    // handle change
    useEffect(() => {
        setCurrentCollapsed(collapsed);
        applyCustomSpace({setCurrentCollapsed, collapsed});
        localStorage.setItem("collapsedMenu", JSON.stringify(collapsed));
    }, [collapsed]);

    const value: ValueProps = {
        collapsed,
        setCollapsed,
        currentCollapsed
    };

    return (
        <CollapsedMenuContext value={value}>
            {children}
        </CollapsedMenuContext>
    );
}

function useCollapsedMenu() {
    const context: ValueProps | null = use(CollapsedMenuContext);
    if (!context) throw new Error("useCollapsedMenu must be used within the context");
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export {CollapsedMenuProvider, useCollapsedMenu};
