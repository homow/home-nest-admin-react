import type {Context} from "react";
import type {UserResponse} from "@/types/auth.types";
import type {ChildrenProps} from "@/types/common.types";
import {createContext, use, useEffect, useState} from "react";
import {getAccessToken} from "@api/axios-instance";
import {refresh} from "@api/requests/auth";

interface SetAuthInfoProps {
    userData: UserResponse;
    token: string;
}

interface ValueProps {
    user: UserResponse;
    accessToken: string;
    setAuthInfo: ({userData, token}: SetAuthInfoProps) => void;
    loading: boolean;
}

const AuthContext: Context<ValueProps | null> = createContext<ValueProps | null>(null);

const initUser: UserResponse = {
    display_name: "",
    role: "user",
    email: "",
    id: ""
}

function AuthProvider({children}: ChildrenProps) {
    const [user, setUser] = useState<UserResponse>({
        display_name: "",
        role: "user",
        email: "",
        id: ""
    });
    const [accessToken, setAccessToken] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await refresh();

                if (res?.ok) {
                    setAuthInfo({userData: res.user, token: res.accessToken});
                } else {
                    setAuthInfo({userData: initUser, token: ""});
                }
                setLoading(false);
            } catch (e) {
                console.log(e)
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (accessToken) getAccessToken(accessToken);
    }, [accessToken]);

    function setAuthInfo({userData, token}: SetAuthInfoProps) {
        setUser(userData);
        setAccessToken(token);
    }

    const value: ValueProps = {
        user,
        accessToken,
        setAuthInfo,
        loading
    };

    return (
        <AuthContext value={value}>
            {children}
        </AuthContext>
    );
}

function useAuth () {
    const context: ValueProps | null = use(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export {AuthProvider, useAuth};