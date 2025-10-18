import {Navigate, Outlet} from "react-router-dom";

export default function PublicRoutes() {
    const isLoggedIn = false;

    return isLoggedIn ? <Navigate to="/"/> : <Outlet/>
}
