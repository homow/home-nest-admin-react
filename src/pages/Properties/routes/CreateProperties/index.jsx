import {useEffect, useState, useRef} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm";
import {createProperty, uploadPropertyImages} from "@api/requests/properties.js"
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
                console.log("ok pr:", propertyRes?.data);

                imagesFormData.current.append("property_id", propertyRes?.data?.id);

                try {
                    const imgRes = await uploadPropertyImages(imagesFormData);
                    console.log(imgRes);
                } catch (e) {
                    console.log("not ok img:", e);
                }
            } else {
                console.log("not ok pr:", propertyRes);
            }
        } catch (e) {
            console.log("e on pr:", e)
        }

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