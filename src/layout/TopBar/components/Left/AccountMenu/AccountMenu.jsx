import {useState} from "react";
import Overlay from "@components/ui/Overlay";
import AccountAvatar from "../../common/AccountAvatar";
import DropDownAccount from "./DropDownAccount";

export default function Account() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* overlay */}
            <Overlay flag={open} setFlag={setOpen}/>

            <div
                className={"relative z-20"}
                onClick={() => setOpen(true)}
            >
                {/* account avatar */}
                <AccountAvatar className={"cursor-pointer"}/>

                {/* drop down account settings and option */}
                <DropDownAccount open={open}/>
            </div>
        </>
    )
}
