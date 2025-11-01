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
        setLoading(true);
        const fixData = {
            tags: data.tags ? data.tags.split("،").map(item => item.trim()) : undefined,
            price_with_discount: data.price_with_discount?.trim() ? parsePriceFromString(data.price_with_discount) : undefined,
            price: data.price.trim() ? parsePriceFromString(data.price) : "توافقی",
            metadata: data.metadata.trim() ? buildObjectFromKeyValueArray(data.metadata.split("،")) : undefined,
            discount_until: data.discount_until.trim() ? data.discount_until : undefined,
            title: data.title.trim(),
            description: data.description.trim(),
            province_and_city: data.province_and_city.trim(),
            address: data.address.trim(),
            property_number: data.property_number.trim() ? data.property_number.trim() : undefined,
        }
        const dataProperty = {
            ...data,
            ...fixData
        }

        console.log("dataProperty:", dataProperty);
        imagesFormData.current.append("property_id", 124124)

        const res = Array.from(imagesFormData.current);
        console.log("images:", res);

        setLoading(false);
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