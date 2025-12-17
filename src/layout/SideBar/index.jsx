import {CollapsedMenuProvider} from "@context/CollapsedMenuContext.tsx";
import SideBarHeader from "./components/SideBarHeader";
import SideBarMenu from "./components/SideBarMenu";
import {useMobileNav} from "@context/MobileNavContext.tsx";
import {cn} from "@utils/ui-utils.ts";

export default function SideBar() {
    const {openMobileNav} = useMobileNav();

    return (
        <CollapsedMenuProvider>
            <aside id="side-bar" className={cn("fixed overflow-hidden top-0 pl-4.5 transition-all text-sm max-md:mobile-nav md:w-custom md:text-base", openMobileNav ? "max-md:right-0" : "max-md:-right-58")}>

                {/* side bar header */}
                <SideBarHeader/>

                {/* side bar nav menu links */}
                <SideBarMenu/>
            </aside>
        </CollapsedMenuProvider>
    )
}
