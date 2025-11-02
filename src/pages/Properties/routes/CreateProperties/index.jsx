import {useEffect, useState, useRef} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm";
import {createProperty} from "@api/requests/properties.js"
import {fixPropertyData} from "@utils/api-utils.js"

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);
    const imagesFormData = useRef(null);

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه";
    }, []);

    const createPropertyHandler = async data => {
        setLoading(true);
        const fixData = fixPropertyData(data);
        const dataProperty = {
            ...data,
            ...fixData
        }

        try {
            const propertyRes = await createProperty(dataProperty);


            if (propertyRes?.data?.ok) {
                console.log("ok:", propertyRes?.data);

            } else {
                console.log("not ok:", propertyRes);
            }
        } catch (e) {
            console.log("e:", e)
        }

        // بعدا اینو وقتی ملک ثبت شد ایدیشو میذارم بچای این
        imagesFormData.current.append("property_id", "آیدی_معتبر ملک")

        const res = Array.from(imagesFormData.current);
        console.log("images:", res);

        setLoading(false);
    };

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