import {Link} from "react-router-dom";
import {cn} from "@/lib/utils/utils.js";
import AccountAvatar from "@components/common/AccountAvatar.jsx";

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

export default function DropDownAccount({open, className}) {
    return (
        <div className={cn("w-58 absolute top-full left-0 z-30 bg-main-bg py-2  rounded-md shadow-2xl", className, open ? "block" : "hidden")}>

            {/* account avatar */}
            <AccountAvatar/>
        </div>
    )
}
