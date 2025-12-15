import {Navigate, Outlet} from "react-router";
import {useAuth} from "@/context/AuthContext";

export default function PrivateRoutes() {
    const {accessToken} = useAuth();
    return accessToken ? <Outlet/> : <Navigate to="/login"/>
};