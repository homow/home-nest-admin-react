import {Link} from "react-router-dom";
import {cn} from "@/lib/utils/ui-utils";
import {useAuth} from "@context/AuthContext"
import ConfirmModal from "@components/ui/ConfirmModal"
import AccountAvatar from "../../common/AccountAvatar";
import {logout} from "@api/callApi.js";
import {useState} from "react";

function DropDownAccountOptions({data}) {
    const iconElem = icon => {
        return (
            <span>
                <svg className={"size-5"}>
                    <use href={`#${icon}-icon`}></use>
                </svg>
            </span>
        )
    }

    return (
        <ul className={"space-y-3 px-4 mt-4"}>
            {data.map(link => {
                return (
                    <li key={link.name} className={"w-full"}>
                        {link.url ? (
                            <Link to={`${link.url}`} className={"w-full flex flex-row items-start gap-2"}>
                                {iconElem(link.icon)}
                                {link.name}
                            </Link>
                        ) : (
                            <p {...link?.props} className={"flex flex-row items-center gap-2 cursor-pointer"}>
                                {iconElem(link.icon)}
                                {link.name}
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
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    // drop down options
    const openLogoutHandler = () => {
        setOpenLogoutModal(true);
    }

    const closeLogoutHandler = () => setOpenLogoutModal(false);

    const dropDownAccountOptionsData = [
        {icon: "user", url: "/account", name: "اکانت"},
        {icon: "logout", props: {onClick: openLogoutHandler}, name: "خروج"},
    ];

    return (
        <div className={cn("w-58 mt-2 absolute top-full left-0 z-30 bg-main-bg py-2  rounded-md shadow-2xl", className, open ? "block" : "hidden")}>

            {/* account info */}
            <AccountInfo/>

            {/* drop down options */}
            <DropDownAccountOptions data={dropDownAccountOptionsData}/>

            <ConfirmModal title={"خروج از حساب"} message={"مطمئنی از حسابت میخوای خارج بشی؟"} onConfirm={""} onCancel={closeLogoutHandler} isOpen={openLogoutModal} dangerMode={true}/>
        </div>
    )
};
