import {useContext, createContext, useState} from "react";

const CollapsedMenuContext = createContext(null);

const CollapsedMenuProvider = ({children}) => {
    const [collapsed, setCollapsed] = useState(false);

    const value = {
        collapsed,
        setCollapsed
    }

    return (
        <CollapsedMenuContext.Provider value={value}>
            {children}
        </CollapsedMenuContext.Provider>
    )
}

const useCollapsedMenu = () => {
    const context = useContext(CollapsedMenuContext);
    if (!context) throw new Error('useCollapsedMenu must be used within the context');
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export {CollapsedMenuProvider, useCollapsedMenu};