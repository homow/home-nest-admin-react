import {useState} from "react";
import {Link} from "react-router-dom";
import {cn} from "@/lib/utils/ui-utils";
import Overlay from "@components/ui/Overlay";
import AlertModal from "@components/ui/AlertModal";
import ConfirmModal from "@components/ui/ConfirmModal";
import AccountAvatar from "../../common/AccountAvatar";
import {useAuth} from "@context/AuthContext";
import {logout} from "@api/requests/auth.js";

function DropDownAccountOptions({data, className}) {
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
        <ul className={cn("divide-y divide-disable-txt/30", className)}>
            {data.map(link => {
                return (
                    <li key={link.name} className={"w-full px-4 py-0.5 *:py-1.5 *:hover:opacity-70 *:transition-all *:duration-300 *:rounded-md *:active:bg-violet-500 *:active:text-white"}>
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

function AccountInfo({className}) {
    const {user} = useAuth();

    return (
        <div dir={"ltr"} className={`px-5 flex flex-row items-start gap-4 ${className}`}>
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
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const {setAuthInfo} = useAuth();

    // drop down options
    const openLogoutModalHandler = () => {
        setOpenLogoutModal(true);
    }

    // close logout modal
    const closeLogoutModalHandler = () => setOpenLogoutModal(false);

    const logoutHandler = async () => {
        try {
            const res = await logout();

            if (res.ok) {
                console.log(res)
                setIsOpenAlertModal(true);

                setTimeout(() => {
                    setOpenLogoutModal(false);
                    setIsOpenAlertModal(false);
                    setAuthInfo({userData: {}, accessToken: null});
                }, 4000);
            } else {
                console.log("res error:", res)
            }
        } catch (e) {
            console.log(e)
        }
    }

    /// drop down option
    const dropDownAccountOptionsData = [
        {icon: "user", url: "/account", name: "اکانت"},
        {icon: "logout", props: {onClick: openLogoutModalHandler}, name: "خروج"},
    ];

    return (
        <div className={cn("w-58 mt-2 absolute top-full left-0 z-30 bg-main-bg py-2  rounded-md shadow-2xl", className, open ? "block" : "hidden")}>

            {/* account info */}
            <AccountInfo className={"pb-4 border-b border-disable-txt/50"}/>

            {/* drop down options */}
            <DropDownAccountOptions className={"pt-2"} data={dropDownAccountOptionsData}/>

            {/* confirm logout modal */}
            <ConfirmModal title={"خروج از حساب"} message={"مطمئنی از حسابت میخوای خارج بشی؟"} onConfirm={logoutHandler} onCancel={closeLogoutModalHandler} isOpen={openLogoutModal} cancelText={"نه"} confirmText={"آره"} dangerMode={true}/>

            {/* overlay */}
            <Overlay flag={openLogoutModal} setFlag={setOpenLogoutModal}/>

            {/* alert modal for success message after logout */}
            <AlertModal isOpen={isOpenAlertModal} message={"خروج موفق بود"} type={"success"}/>
        </div>
    )
};
