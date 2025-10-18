import {Navigate, Outlet} from "react-router-dom";
import useIsLogin from "@hooks/useIsLogin.jsx"

export default function PrivateRoutes() {
    const isLoggedIn = useIsLogin();
    return isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
}
