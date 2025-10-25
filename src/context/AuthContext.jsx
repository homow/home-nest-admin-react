import {createContext, useContext, useEffect, useState} from "react";
import {setAccessTokenGetter} from "@api/axiosInstance.js";
import {refresh} from "@api/requests/auth.js";

const AuthContext = createContext(null);

function AuthProvider({children}) {
    const [user, setUser] = useState({
        id: "1",
        role: "admin",
        display_name: "homow",
        email: "homow@gmail.com",
    });
    const [accessToken, setAccessToken] = useState(true);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const res = await refresh();
    //
    //             if (res?.ok) {
    //                 setAuthInfo({userData: res.user, token: res.accessToken});
    //             } else {
    //                 console.log("res not ok:", res)
    //                 setAuthInfo({userData: null, token: null});
    //             }
    //             setLoading(false);
    //         } catch (e) {
    //             console.log(e)
    //             setLoading(false);
    //         }
    //     })();
    // }, []);

    useEffect(() => {
        setAccessTokenGetter(accessToken);
    }, [accessToken]);

    const setAuthInfo = ({userData, token}) => {
        setUser(userData);
        setAccessToken(token);
    };

    const value = {
        user,
        accessToken,
        setAuthInfo,
        loading
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

// eslint-disable-next-line react-refresh/only-export-components
export {AuthProvider, useAuth};

{
    const exampleUser = {
        id: "1",
        role: "admin",
        display_name: "homow",
        email: "homow@gmail.com",
    }
}