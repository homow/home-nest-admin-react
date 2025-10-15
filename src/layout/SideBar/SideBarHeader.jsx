import {cn} from "@/lib/utils.js";

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
            <a target="_blank" href="https://homow.ir" className={"pl-4 flex flex-row items-center gap-2 hover:opacity-100"}>
                <span>
                    <svg className={"w-7.5 h-[23px]"}>
                        <use href="#logo-icon"></use>
                    </svg>
                </span>
                <span className={`font-medium ${collapsed && "hidden"}`}>آشیانه</span>
            </a>

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
