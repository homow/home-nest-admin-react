import {createBrowserRouter} from "react-router-dom";
import LazyWithSuspense from "@ui/suspense/LazyWithSuspense";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import {BASE_PATH} from "@/config";
import App from "@/App";
import MainLayout from "@/layout/MainLayout";

const Login = LazyWithSuspense(() => import("@pages/Login"), "fixed inset-0");
const Home = LazyWithSuspense(() => import("@pages/Home"));
const Properties = LazyWithSuspense(() => import("@pages/Properties"));
const CreateProperties = LazyWithSuspense(() => import("@pages/Properties/routes/CreateProperties"))
const EditProperties = LazyWithSuspense(() => import("@pages/Properties/routes/EditProperties"))
const Email = LazyWithSuspense(() => import("@pages/Email"));
const User = LazyWithSuspense(() => import("@pages/User"));
const Rules = LazyWithSuspense(() => import("@pages/Rules"));
const NotFound = LazyWithSuspense(() => import("@pages/NotFound"));

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
