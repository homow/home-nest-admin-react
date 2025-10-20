import {createContext, useContext, useState} from "react";

const AuthContext = createContext(null);

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const setAuthInfo = ({userData, token}) => {
        setUser(userData);
        setAccessToken(token);
    };

    const value = {
        user,
        accessToken,
        setAuthInfo,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export {AuthProvider, useAuth};