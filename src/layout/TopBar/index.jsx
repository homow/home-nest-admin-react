import LeftTopBar from './layout/LeftTopBar';
import RightTopBar from "./layout/RightTopBar";

export default function TopBar({setMobileNavOpen}) {
    return (
        <header className={"flex items-center justify-between top-0 h-16 md:justify-end"}>

            {/* right top bar */}
            <RightTopBar setMobileNavOpen={setMobileNavOpen}/>

            {/* left top bar */}
            <LeftTopBar/>
        </header>
    )
}
