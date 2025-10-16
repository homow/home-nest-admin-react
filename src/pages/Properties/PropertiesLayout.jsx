import {NavLink, Outlet} from "react-router-dom";
import useIsExactRoute from "@hooks/useIsExactRout.jsx";
import {cn} from "@/lib/utils";

const PropertiesLinks = () => {
    const isActiveLinks = isActive => cn(isActive && "text-violet-500")

    return (
        <ul className={"flex flex-row items-center divide-x divide-secondary-txt *:not-last:pl-4 *:not-first:pr-4"}>
            <li>
                <NavLink
                    end={true}
                    className={({isActive}) => isActiveLinks(isActive)}
                    to={"/properties"}>
                    ملک ها
                </NavLink>
            </li>
            <li>
                <NavLink
                    className={({isActive}) => isActiveLinks(isActive)}
                    to={"/properties/edit"}>
                    تغییر جزئیات ملک‌ها
                </NavLink>
            </li>
            <li>
                <NavLink
                    className={({isActive}) => isActiveLinks(isActive)}
                    to={"/properties/create"}>
                    اضافه کردن ملک
                </NavLink>
            </li>
        </ul>
    )
}

export default function PropertiesLayout() {
    const isRoot = useIsExactRoute("/properties");

    return (
        <>
            <section className={"main-components space-y-8"}>
                <h1 className={"text-center"}>مدیریت ملک‌ها</h1>
                <PropertiesLinks/>
            </section>

            <section className={"main-section"}>
                {!isRoot ? <Outlet/> : <p>ملک ها</p>}
            </section>
        </>
    );
};
