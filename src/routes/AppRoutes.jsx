import {useRoutes} from "react-router-dom";
import Home from "@pages/Home"
import Analytics from "@pages/Analytics";
import Properties from "@pages/Analytics/Properties/Properties.jsx";
import Email from "@pages/Email";
import User from "@pages/User";
import Rules from "@pages/Rules";

export default function AppRoutes() {
    return useRoutes([
        {path: "/", element: <Home/>},
        {path: "analytics", element: <Analytics/>},
        {path: "/analytics/properties", element: <Properties/>},
        {path: "email", element: <Email/>},
        {path: "user", element: <User/>},
        {path: "rules", element: <Rules/>},
    ])
}
