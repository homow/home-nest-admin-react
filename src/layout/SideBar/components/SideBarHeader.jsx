import {useEffect, useCallback, useState} from "react";
import {Link} from "react-router-dom";
import logo from "@img/logo.webp"
import {cn} from "@utils/ui-utils.js";
import Icon from "@components/ui/icons/Icon";
import {useCollapsedMenu} from "@context/CollapsedMenuContext";

export default function SideBarHeader() {
    const [titleStyle, setTitleStyle] = useState("");
    const {collapsed, setCollapsed} = useCollapsedMenu();

    // apply collapsed state from size
    const applySpacing = useCallback(collapsedState => {
        if (window.innerWidth < 896) {
            document.documentElement.style.setProperty("--spacing-custom", "0px");
            setTitleStyle("");
        } else {
            document.documentElement.style.setProperty(
                "--spacing-custom",
                collapsedState ? "80px" : "260px"
            );
            setTitleStyle(collapsed ? "hidden" : "");
        }
    }, [collapsed]);

    // run in component mounted
    useEffect(() => {
        applySpacing(collapsed);
    }, [applySpacing, collapsed]);

    // apply space in resize
    useEffect(() => {
        const handleResize = () => applySpacing(collapsed);

        window.addEventListener("resize", handleResize);

        // cleanUp event
        return () => window.removeEventListener("resize", handleResize);
    }, [collapsed, applySpacing]);

    // toggle collapse when click to button
    const toggleCollapse = () => {
        setTitleStyle(collapsed ? "hidden" : "");
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("collapsedMenu", JSON.stringify(newState));
        applySpacing(newState);
    };

    return (
        <div className={"relative flex items-center justify-between h-16"}>

            {/* brand and logo */}
            <Link to="/" className={"pr-4 flex flex-row items-center gap-4 hover:text-primary-txt"}>
                <img className={"size-8"} src={`${logo}`} alt="ashianeh logo"/>
                <span className={cn("font-medium", titleStyle)}>پنل مدیریت</span>
            </Link>

            <span
                onClick={toggleCollapse}
                className={cn("hidden md:flex items-center justify-center absolute -left-5.5 cursor-pointer -rotate-180 transition-all duration-500", collapsed && "rotate-0")}
            >
                <Icon icon={"chevronDoubleRight"} className={"size-5"}/>
            </span>
        </div>
    );
};
