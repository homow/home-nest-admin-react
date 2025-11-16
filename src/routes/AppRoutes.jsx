import {lazy} from "react";
import {createBrowserRouter} from "react-router-dom";
import SuspenseBoundary from "@components/ui/SuspenseBoundary";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import {BASE_PATH} from "@/config.js";
import App from "@/App";
import MainLayout from "@/layout/MainLayout";

const lazyWithSuspense = (importFunc, className) => {
    const Component = lazy(importFunc);

    return props => (
        <SuspenseBoundary className={className}>
            <Component {...props}/>
        </SuspenseBoundary>
    );
};

const Login = lazyWithSuspense(() => import("@pages/Login"), "fixed inset-0");
const Home = lazyWithSuspense(() => import("@pages/Home"));
const Properties = lazyWithSuspense(() => import("@pages/Properties"));
const CreateProperties = lazyWithSuspense(() => import("@pages/Properties/routes/CreateProperties"))
const EditProperties = lazyWithSuspense(() => import("@pages/Properties/routes/EditProperties"))
const Email = lazyWithSuspense(() => import("@pages/Email"));
const User = lazyWithSuspense(() => import("@pages/User"));
const Rules = lazyWithSuspense(() => import("@pages/Rules"));
const NotFound = lazyWithSuspense(() => import("@pages/NotFound"));

// routes
const router = createBrowserRouter(
    [{
        element: <App/>,
        children: [
            // when admin not login
            {
                path: "/login",
                element: <PublicRoutes/>,
                children: [
                    {index: true, element: <Login/>}
                ]
            },
            // when admin login
            {
                element: <PrivateRoutes/>,
                children: [
                    {
                        element: <MainLayout/>,
                        children: [
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
                            {path: "/rules", element: <Rules/>},
                            // 404 | not found
                            {path: "*", element: <NotFound/>}
                        ]
                    },
                ]
            },
        ]
    }],
    {
        basename: BASE_PATH
    }
);

export default router;
