import {lazy} from "react";
import {useRoutes} from "react-router-dom";
import SuspenseBoundary from "@components/ui/SuspenseBoundary";

const Home = lazy(() => import("@pages/Home"));
const Analytics = lazy(() => import("@pages/Analytics"));
const Properties = lazy(() => import("@pages/Analytics/Properties/Properties.jsx"));
const Email = lazy(() => import("@pages/Email"));
const User = lazy(() => import("@pages/User"));
const Rules = lazy(() => import("@pages/Rules"));

export default function AppRoutes() {
    return (
        <SuspenseBoundary>
            {useRoutes([
                {path: "/", element: <Home/>},
                {path: "analytics", element: <Analytics/>},
                {path: "/analytics/properties", element: <Properties/>},
                {path: "email", element: <Email/>},
                {path: "user", element: <User/>},
                {path: "rules", element: <Rules/>},
            ])}
        </SuspenseBoundary>
    )
}
