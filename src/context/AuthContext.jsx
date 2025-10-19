"use client";

import {createContext, useContext, useState, useEffect, useCallback} from "react";
import {login as apiLogin, refresh as apiRefresh} from "@api/callApi.js";
import axios from "axios";

const AuthContext = createContext(null);

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const tryRefresh = useCallback(async () => {
        try {
            const res = apiRefresh();
        } catch (e) {

        }
    });

    return (
        <AuthContext.Provider value={{user, accessToken, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export default useAuth;