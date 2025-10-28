import {useEffect, useState} from "react";
import Overlay from "@components/ui/Overlay";
import AccountAvatar from "../../common/AccountAvatar";
import DropDownAccount from "./DropDownAccount";
import useScrollLock from "@hooks/useScrollLock";
import {escapeStack} from "@/lib/utils/ui-utils.js"

export default function Account() {
    const [open, setOpen] = useState(false);
    useScrollLock(open);

    // close dropDown menu with Escape key
    useEffect(() => {
        open && escapeStack.push(() => setOpen(false));

        return () => {
            escapeStack.remove(() => setOpen(false));
        }
    }, [open])

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
