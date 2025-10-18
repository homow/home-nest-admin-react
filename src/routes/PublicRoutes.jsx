import {Navigate, Outlet} from "react-router-dom";
import useIsLogin from "@hooks/useIsLogin.jsx"

export default function PublicRoutes() {
    const isLoggedIn = useIsLogin();
    return isLoggedIn ? <Navigate to="/"/> : <Outlet/>
}
