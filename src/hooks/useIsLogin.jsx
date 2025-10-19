import {useState} from "react";

export default function useIsLogin() {
    const [userIsLogin, setUserIsLogin] = useState(false);

    return {userIsLogin, setUserIsLogin};
}
