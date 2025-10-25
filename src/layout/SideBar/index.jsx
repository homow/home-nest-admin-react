import {useState} from 'react'
import SideBarHeader from "./components/SideBarHeader";
import SideBarMenu from "./components/SideBarMenu";
import {useMobileNav} from "@context/MobileNavContext";

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const {openMobileNav} = useMobileNav();

    return (
        <aside id="side-bar" className={`fixed overflow-hidden top-0 pl-4.5 transition-all text-sm max-md:mobile-nav ${openMobileNav ? "max-md:right-0" : "max-md:-right-58"} md:w-custom md:text-base}`}>

            {/* side bar header */}
            <SideBarHeader collapsed={collapsed} setCollapsed={setCollapsed}/>

            {/* side bar nav menu links */}
            <SideBarMenu collapsed={collapsed}/>
        </aside>
    )
}
