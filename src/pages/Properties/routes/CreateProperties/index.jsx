import {useEffect, useState, useRef} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm"

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);
    const imagesFormData = useRef(null);

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه"
    }, []);

    const createPropertyHandler = data => {
        setLoading(true);
        console.log("createPropertyHandler", data);
        setLoading(false);
        console.log(imagesFormData.current)
    }

    return (
        <div className={"space-y-12"}>
            <h3>افزودن ملک جدید</h3>

            {/* image property form */}
            <ImagesForm refData={imagesFormData}/>

            {/* data property form */}
            <CreatePropertyForm
                onSubmit={createPropertyHandler}
                isLoading={loading}
            />
        </div>
    );
};