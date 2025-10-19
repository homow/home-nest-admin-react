import {createContext, useContext, useState} from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const login = ({userData, token}) => {
        setUser(userData);
        setAccessToken(token);
    };

    const value = {
        user,
        accessToken,
        login,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 6️⃣ Hook راحت برای استفاده
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
