import {useEffect} from "react";
import PropertiesLayout from "./PropertiesLayout";

export default function Properties() {
    useEffect(() => {
        document.title = "مدیریت ملک‌ها | آشیانه";
    }, []);

    return <PropertiesLayout/>
}
