import {Link} from "react-router-dom";
import logo from "@img/logo.webp"
import {cn} from "@utils/ui-utils.js";
import Icon from "@components/ui/icons/Icon";
import {useCollapsedMenu} from "@context/CollapsedMenuContext";

export default function SideBarHeader() {
    const {collapsed, currentCollapsed, setCollapsed} = useCollapsedMenu();

    // toggle collapse when click to button
    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <div className={"relative flex items-center justify-between h-16"}>

            {/* brand and logo */}
            <Link to="/" className={"pr-4 flex flex-row items-center gap-4 hover:text-primary-txt"}>
                <img className={"size-8"} src={`${logo}`} alt="ashianeh logo"/>
                <span className={cn("font-medium", currentCollapsed)}>پنل مدیریت</span>
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
