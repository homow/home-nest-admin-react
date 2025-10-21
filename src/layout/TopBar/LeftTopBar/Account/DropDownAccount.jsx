import {cn} from "@/lib/utils/utils.js";
import AccountAvatar from "@components/common/AccountAvatar.jsx";

export default function DropDownAccount({open, className}) {
    return (
        <div className={cn("w-58 absolute top-full left-0 z-30 bg-main-bg shadow-2xl", className, open ? "block" : "hidden")}>
            <AccountAvatar/>
        </div>
    )
}
