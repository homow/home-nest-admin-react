import {NavLink, Outlet} from "react-router-dom";
import useIsExactRoute from "@hooks/useIsExactRoute";
import AllProperties from "./AllProperties"
import {cn} from "@utils/ui-utils.ts";

const propertyRoutesData = [
    {link: "/properties", name: "ملک ها", props: {end: true}},
    {link: "/properties/create", name: "ملک جدید"},
    {link: "/properties/edit", name: "تغییر ملک ها"},
]

const PropertiesRoutes = ({link, name, props}) => {
    const isActiveLinks = isActive => cn(isActive && "text-violet-500")

    return (
        <li>
            <NavLink
                {...props}
                className={({isActive}) => isActiveLinks(isActive)}
                to={link}>
                {name}
            </NavLink>
        </li>
    )
}

export default function PropertiesLayout() {
    const isRoute = useIsExactRoute("/properties");

    return (
        <>
            <section className={"main-components space-y-8"}>
                <h1 className={"text-center"}>مدیریت ملک‌ها</h1>

                <ul
                    className={"flex flex-row items-center divide-x divide-secondary-txt *:not-last:pl-4 *:not-first:pr-4"}
                >
                    {propertyRoutesData.map(property => (
                        <PropertiesRoutes key={property.link} {...property}/>
                    ))}
                </ul>
            </section>

            <section className={"main-components"}>
                {isRoute ? <AllProperties/> : <Outlet/>}
            </section>
        </>
    );
};
