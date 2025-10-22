import logo from "@img/logo.webp"
import {cn} from "@/lib/utils/ui-utils.js";
import {Link} from "react-router-dom";

export default function SideBarHeader({collapsed, setCollapsed}) {

    const toggleCollapse = () => {
        document.documentElement.style.setProperty(
            "--spacing-custom",
            !collapsed ? "80px" : "260px"
        );
        setCollapsed(!collapsed)
    };

    return (
        <div className={"relative flex items-center justify-between h-16"}>

            {/* brand and logo */}
            <Link to="/" className={"pr-4 flex flex-row items-center gap-4 hover:opacity-100"}>
                <img className={"size-8"} src={`${logo}`} alt="ashianeh logo"/>
                <span className={`font-medium ${collapsed && "hidden"}`}>پنل مدیریت</span>
            </Link>

            <span
                onClick={toggleCollapse}
                className={cn(`hidden md:inline absolute -left-5.5 cursor-pointer -rotate-180 transition-all duration-500 ${collapsed && "rotate-0"}`)}
            >
                <svg className={"size-5"}>
                    <use href="#chevronDoubleRight-icon"></use>
                </svg>
            </span>
        </div>
    );
};
