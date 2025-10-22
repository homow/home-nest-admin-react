import {Link} from "react-router-dom";
import {cn} from "@/lib/utils/ui-utils";
import {useAuth} from "@context/AuthContext"
import ConfirmModal from "@components/ui/ConfirmModal"
import AccountAvatar from "../../common/AccountAvatar";
import {logout} from "@api/callApi.js";

function DropDownAccountOptions({data}) {
    const iconElem = (
        <span>
            <svg className={"size-5"}>
                <use href={`#${data.icon}-icon`}></use>
            </svg>
        </span>
    )

    return (
        <ul>
            {data.map(link => {
                return (
                    <li className={"w-full"}>
                        {link.url ? (
                            <Link to={`${data.url}`} className={"w-full flex flex-row items-center gap-4"}>
                                {iconElem}
                                {data.name}
                            </Link>
                        ) : (
                            <p {...link.props}>
                                {iconElem}
                                {data.name}
                            </p>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

function AccountInfo() {
    const {user} = useAuth();

    return (
        <div dir={"ltr"} className={"px-5 flex flex-row items-center gap-4"}>
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
    // drop down options
    const logoutHandler = () => {

    }

    const dropDownAccountOptionsData = [
        {icon: "user", url: "/account", name: ""},
        {icon: "logout", props: {onClick: logoutHandler}},
    ];

    return (
        <div className={cn("w-58 mt-2 absolute top-full left-0 z-30 bg-main-bg py-2  rounded-md shadow-2xl", className, open ? "block" : "hidden")}>

            {/* account info */}
            <AccountInfo/>

            {/* logout in drop-down account menu */}
            <div>

            </div>
        </div>
    )
}
