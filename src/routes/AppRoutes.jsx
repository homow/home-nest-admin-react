import {lazy} from "react";
import {useRoutes} from "react-router-dom";
import SuspenseBoundary from "@components/ui/SuspenseBoundary";

const Auth = lazy(() => import("@pages/Auth"));
const Home = lazy(() => import("@pages/Home"));
const Properties = lazy(() => import("@pages/Properties"));
const CreateProperties = lazy(() => import("@pages/Properties/routes/CreateProperties"))
const EditProperties = lazy(() => import("@pages/Properties/routes/EditProperties"))
const Email = lazy(() => import("@pages/Email"));
const User = lazy(() => import("@pages/User"));
const Rules = lazy(() => import("@pages/Rules"));

export default function AppRoutes() {
    return (
        <SuspenseBoundary>
            {useRoutes([
                {path: "/auth", element: <Auth/>},
                {path: "/", element: <Home/>},
                {
                    path: "/properties", element: <Properties/>,
                    children: [
                        {path: "create", element: <CreateProperties/>},
                        {path: "edit", element: <EditProperties/>},
                    ]
                },
                {path: "/email", element: <Email/>},
                {path: "/user", element: <User/>},
                {path: "/rules", element: <Rules/>}
            ])}
        </SuspenseBoundary>
    )
}
