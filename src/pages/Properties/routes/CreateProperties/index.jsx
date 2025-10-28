import {useEffect, useState} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm"

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه"
    }, []);

    const createPropertyHandler = data => {
        setLoading(true);
        console.log("createPropertyHandler", data);
        setLoading(false);
    }

    return (
        <div className={"space-y-8"}>
            <h3>افزودن ملک جدید</h3>

            {/* image property form */}
            <ImagesForm/>

            {/* data property form */}
            <CreatePropertyForm
                onSubmit={createPropertyHandler}
                isLoading={loading}
            />
        </div>
    );
};