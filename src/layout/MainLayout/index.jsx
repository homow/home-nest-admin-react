import {Outlet} from "react-router-dom";
import TopBar from "@/layout/TopBar";
import SideBar from "@/layout/SideBar";
import Footer from "@/layout/Footer";
import SvgDefs from "@components/ui/SvgDefs.jsx";
import Overlay from "@components/ui/Overlay.jsx";
import {useState} from "react";

export default function MainLayout() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    return (
        <section id="app-container" className="flex flex-row min-h-screen">

            {/* svg icons */}
            <SvgDefs/>

            {/* overlay */}
            <Overlay flag={mobileNavOpen} setFlag={setMobileNavOpen}/>

            {/* side bar menu and links */}
            <SideBar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen}/>

            <section className={"transition-all mr-custom flex-1 px-3 sm:px-6 flex flex-col"}>

                {/* top bar | header */}
                <TopBar mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen}/>

                {/* main content */}
                <main
                    id="main"
                    className={"@container/main relative h-full pb-5 space-y-6"}>

                    {/* Routes */}
                    <Outlet/>
                </main>

                {/* footer */}
                <Footer/>
            </section>
        </section>
    )
}
