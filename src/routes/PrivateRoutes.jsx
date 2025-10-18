import {Navigate, Outlet} from "react-router-dom";

export default function PrivateRoutes() {
    const isLoggedIn = false;

    return isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
}
