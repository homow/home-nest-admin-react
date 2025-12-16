import {use, createContext, useState, useEffect, useEffectEvent} from "react";
import {applyCustomSpace, getCollapsedMeniInStorage} from "@utils/ui-utils";

const CollapsedMenuContext = createContext(null);

const CollapsedMenuProvider = ({children}) => {
    const [collapsed, setCollapsed] = useState(getCollapsedMeniInStorage);
    const [currentCollapsed, setCurrentCollapsed] = useState(false);

    const handleResize = useEffectEvent(() => {
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

    const value = {collapsed, setCollapsed, currentCollapsed};

    return (
        <CollapsedMenuContext value={value}>
            {children}
        </CollapsedMenuContext>
    );
};

const useCollapsedMenu = () => {
    const context = use(CollapsedMenuContext);
    if (!context) throw new Error("useCollapsedMenu must be used within the context");
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export {CollapsedMenuProvider, useCollapsedMenu};
