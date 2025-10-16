import {useEffect} from "react";
import HomePageLayout from "./HomePageLayout.jsx";

export default function Home() {
    useEffect(() => {
        document.title = 'پنل مدیریت | آشیانه';
    }, [])

    return <HomePageLayout/>
}
