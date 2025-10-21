import {useState} from "react";
import Overlay from "@components/ui/Overlay.jsx";
import AccountAvatar from "@components/common/AccountAvatar.jsx";
import DropDownAccount from "./DropDownAccount.jsx";

export default function Account() {
    const [openDropDown, setOpenDropDown] = useState(false);

    return (
        <>
            {/* overlay */}
            <Overlay flag={openDropDown} setFlag={setOpenDropDown}/>

            <div
                className={"relative z-20"}
                onClick={() => setOpenDropDown(prev => !prev)}
            >
                {/* account avatar */}
                <AccountAvatar className={"cursor-pointer"}/>

                {/* drop down account settings and option */}
                <DropDownAccount open={openDropDown}/>
            </div>
        </>
    )
}
