import {useEffect, useState, useRef} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm";
import {RedStarField} from "@components/ui/Fragments";
import {parsePriceFromString, buildObjectFromKeyValueArray} from "@/lib/utils/helper.js"

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);
    const imagesFormData = useRef(null);

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه";
    }, []);

    const createPropertyHandler = data => {
        const fixData = {
            tags: data.tags ? data.tags.split("،").map(item => item.trim()) : undefined,
            price_with_discount: data.price_with_discount?.trim() ? parsePriceFromString(data.price_with_discount) : undefined,
            price: data.price.trim() ? parsePriceFromString(data.price) : "توافقی",
            metadata: data.metadata.trim() ? buildObjectFromKeyValueArray(data.metadata.split("،")) : undefined,
            discount_until: data.discount_until.trim() ? data.discount_until : undefined,
        }
        const dataProperty = {
            ...data,
            ...fixData
        }
        const res = Array.from(imagesFormData.current);
        console.log("images:", res);
        console.log("dataProperty:", dataProperty);
    };

    return (
        <div className={"space-y-12"}>
            <h3>افزودن ملک جدید</h3>
            <p>فیلدهایی که با <RedStarField/> مشخص شدن اجباری، و بقیه فیلدها اختیاری هستند.</p>

            {/* image property form */}
            <ImagesForm refData={imagesFormData}/>

            {/* data property form */}
            <CreatePropertyForm
                onSubmit={createPropertyHandler}
                isLoading={loading}
                RedStarField={<RedStarField/>}
            />
        </div>
    );
};