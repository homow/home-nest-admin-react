import AppRoutes from "@/routes/AppRoutes.jsx";
import {AuthProvider, useAuth} from "@/context/AuthContext"
import Loading from "@components/ui/Loading";

function InnerApp() {
    const {loading} = useAuth()

    return (
        loading ? (
            <Loading/>
        ) : (
            <AppRoutes/>
        )
    )
}

export default function App() {
    return (
        <AuthProvider>
            <InnerApp/>
        </AuthProvider>
    )
}
