import {Navigate, Outlet} from "react-router-dom";
import useIsLogin from "@hooks/useIsLogin.jsx"

export default function PublicRoutes() {
    const {userIsLogin} = useIsLogin();

    return userIsLogin ? <Navigate to="/"/> : <Outlet/>
}
