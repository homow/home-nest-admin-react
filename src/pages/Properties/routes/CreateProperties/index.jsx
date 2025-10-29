import {useEffect, useState, useRef} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm";
import {parsePriceFromString, buildObjectFromKeyValueArray} from "@/lib/utils/helper.js"

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);
    const imagesFormData = useRef(null);

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه";
    }, []);

    const createPropertyHandler = data => {
        // setLoading(true);
        // setLoading(false);
        const fixData = {
            tags: data.tags.split("،").map(item => item.trim()),
            price_with_discount: data.price_with_discount?.trim() ? parsePriceFromString(data.price_with_discount) : undefined,
            price: parsePriceFromString(data.price),
            metadata_notes: data.metadata_notes.trim() ? buildObjectFromKeyValueArray(data.metadata_notes.split("،")) : undefined,
            discount_until: data.discount_until.trim() ? data.discount_until : undefined,
        }
        const dataProperty = {
            ...data,
            ...fixData
        }
        // const res = Array.from(imagesFormData.current);
        // console.log("images:", res);
        console.log("data:", data);
        console.log("dataProperty:", dataProperty);
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