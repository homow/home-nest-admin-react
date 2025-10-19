import {Navigate, Outlet} from "react-router-dom";
import useIsLogin from "@hooks/useIsLogin.jsx"

export default function PrivateRoutes() {
    const {userIsLogin} = useIsLogin();
    return userIsLogin ? <Outlet/> : <Navigate to="/login"/>
}
