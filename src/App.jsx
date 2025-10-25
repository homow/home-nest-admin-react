import AppRoutes from "@/routes/AppRoutes.jsx";
import {AuthProvider, useAuth} from "@/context/AuthContext.jsx"

function InnerApp() {
    const {loading} = useAuth()

    return (
        loading ? (
            <div className="fixed inset-0 size-full z-50 flex items-center justify-center min-h-screen bg-primary-bg">
                <div className="flex flex-col items-center">
                    <div className="size-20 border-8 border-t-violet-500 border-gray-300 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium animate-pulse">یکم صبر کن ...</p>
                </div>
            </div>
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
