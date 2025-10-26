import {useEffect, useState} from "react";
import CreatePropertyForm from "./CreatePropertyForm"

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه"
    }, []);

    const createPropertyHandler = data => {
        console.log("createPropertyHandler", data);
    }

    return (
        <div>
            <h3></h3>
            <CreatePropertyForm onSubmit={createPropertyHandler} isLoading={loading}/>
        </div>
    );
};