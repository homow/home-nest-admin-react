import {Navigate, Outlet} from "react-router";
import {useAuth} from "@/context/AuthContext";

export default function PublicRoutes() {
    const {accessToken} = useAuth();
    return accessToken ? <Navigate to="/"/> : <Outlet/>
}
