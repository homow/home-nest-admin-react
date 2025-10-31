import {useEffect} from "react";
import Loading from "@components/ui/Loading";

export default function User() {
    useEffect(() => {
        document.title = 'Users | Dashboard';
    }, [])

    return (
        <Loading/>
    )
}
