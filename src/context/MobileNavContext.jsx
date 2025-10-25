import {useState, createContext, useContext} from "react";

const MobileNavContext = createContext(null);

const MobileNavProvider = ({children}) => {
    const [openNavMenu, setOpenNavMenu] = useState(false);

    const value = {
        openNavMenu,
        setOpenNavMenu,
    }

    return (
        <MobileNavContext.Provider value={value}>
            {children}
        </MobileNavContext.Provider>
    )
}

const useMobileNav = () => {
    const context = useContext(MobileNavContext);
    if (!context) throw new Error("useMobileNav must be used within MobileNavProvider");
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export {MobileNavProvider, useMobileNav};