import {CollapsedMenuProvider} from "@context/CollapsedMenuContext";
import SideBarHeader from "./components/SideBarHeader";
import SideBarMenu from "./components/SideBarMenu";
import {useMobileNav} from "@context/MobileNavContext";

export default function SideBar() {
    const {openMobileNav} = useMobileNav();

    return (
        <CollapsedMenuProvider>
            <aside id="side-bar" className={`fixed overflow-hidden top-0 pl-4.5 transition-all text-sm max-md:mobile-nav ${openMobileNav ? "max-md:right-0" : "max-md:-right-58"} md:w-custom md:text-base}`}>

                {/* side bar header */}
                <SideBarHeader/>

                {/* side bar nav menu links */}
                <SideBarMenu/>
            </aside>
        </CollapsedMenuProvider>
    )
}
