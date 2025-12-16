import type {Context, ReactNode} from "react";
import type {User} from "@/types/auth.types";
import {createContext, use, useEffect, useState} from "react";
import {getAccessToken} from "@api/axios-instance";
import {refresh} from "@api/requests/auth";

interface Props {
    children: ReactNode;
}

interface SetAuthInfoProps {
    userData: User;
    token: string;
}

interface ValueProps {
    user: User;
    accessToken: string;
    setAuthInfo: ({userData, token}: SetAuthInfoProps) => void;
    loading: boolean;
}

const AuthContext: Context<ValueProps | null> = createContext<ValueProps | null>(null);

const initUser: User = {
    display_name: "",
    role: "user",
    email: "",
    id: ""
}

function AuthProvider({children}: Props) {
    const [user, setUser] = useState<User>({
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