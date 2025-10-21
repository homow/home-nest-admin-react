import {useState} from "react";
import Overlay from "@components/ui/Overlay.jsx";
import AccountAvatar from "@components/common/AccountAvatar.jsx";
import DropDownAccount from "./DropDownAccount.jsx";

export default function Account() {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={"relative cursor-pointer"}
            onClick={() => setOpen(prevState => !prevState)}
        >
            <AccountAvatar/>
            <DropDownAccount open={open}/>
            <Overlay flag={open} setFlag={setOpen}/>
        </div>
    )
}
