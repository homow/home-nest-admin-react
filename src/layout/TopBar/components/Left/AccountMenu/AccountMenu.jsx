import {useState} from "react";
import Overlay from "@components/ui/Overlay.jsx";
import AccountAvatar from "../../../common";
import DropDownAccount from "./DropDownAccount.jsx";

export default function Account() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* overlay */}
            <Overlay flag={open} setFlag={setOpen}/>

            <div
                className={"relative z-20"}
                onClick={() => setOpen(prev => !prev)}
            >
                {/* account avatar */}
                <AccountAvatar className={"cursor-pointer"}/>

                {/* drop down account settings and option */}
                <DropDownAccount open={open}/>
            </div>
        </>
    )
}
