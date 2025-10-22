import {Link} from "react-router-dom";
import {cn} from "@/lib/utils/ui-utils";
import AccountAvatar from "../../common/AccountAvatar";
import {useAuth} from "@context/AuthContext"

function DropDownAccountOptions({data}) {
    return (
        <ul>
            {data.map(link => {
                return (
                    <li>
                        <span>
                            <svg className={"size-5"}>
                                <use href={`#${data.icon}-icon`}></use>
                            </svg>
                        </span>
                        <Link to={`${data.url}`}>{data.name}</Link>
                    </li>
                )
            })}
        </ul>
    )
}

function AccountInfo() {
    const {user} = useAuth();

    return (
        <div dir={"ltr"} className={"flex flex-row items-center gap-4"}>
            {/* account avatar */}
            <AccountAvatar/>

            {/* account details */}
            <div>
                <p>{user?.display_name}</p>
                <p className={"text-secondary-txt text-sm"}>{user?.role}</p>
            </div>
        </div>
    )
}

export default function DropDownAccount({open, className}) {
    return (
        <div className={cn("w-58 absolute top-full left-0 z-30 bg-main-bg py-2  rounded-md shadow-2xl", className, open ? "block" : "hidden")}>

            {/* account info */}
            <AccountInfo/>
        </div>
    )
}
