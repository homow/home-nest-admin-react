import {useEffect, useState, useRef} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm";
import AlertModal from "@components/ui/modals/AlertModal";
import {createProperty, getProperty, uploadPropertyImages} from "@api/requests/properties.js"
import {delay, fixPropertyData} from "@api/api-utils.js"
import {setErrorInCreateProperty} from "@api/error-handler/property.js";

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);
    const [successCreate, setSuccessCreate] = useState(false);
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const [alertModalData, setAlertModalData] = useState({});
    const imagesFormData = useRef(null);

    useEffect(() => {
        document.title = "افزودن ملک | آشیانه";
    }, []);

    const openAlertModal = data => {
        setIsOpenAlertModal(true);
        setAlertModalData({...data});
    }

    const createPropertyHandler = async data => {
        if (loading) return;

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

                imagesFormData.current.append("property_id", propertyRes?.data?.property?.id);

                const res = await getProperty(propertyRes?.data?.property?.id);
                console.log("get property after create:",res)
                await delay(3000);
                try {
                    for (const f of imagesFormData.current.entries()) {
                        console.log(f);
                    }
                    const imgRes = await uploadPropertyImages(imagesFormData);

                    if (imgRes?.status === "ok") {
                        console.log("imgRes if:", imgRes);
                        setSuccessCreate(true);
                        openAlertModal({type: "success", message: "محصول و تصاویر با موفقیت اضافه شدن."})
                    } else {
                        console.log("imgRes else:", imgRes);
                        openAlertModal({type: "warning", message: "محصول اضافه اما تصاویر نشدن."})
                    }

                } catch (e) {
                    openAlertModal({type: "warning", message: "محصول اضافه اما تصاویر نشدن."});
                    console.log("not ok img:", e);
                }
            } else {
                openAlertModal({type: "error", message: "محصول اضافه نشد."});
                console.log("not ok pr:", propertyRes);
            }
        } catch (e) {
            openAlertModal({type: "error", message: "محصول اضافه نشد."});
            console.log("e on pr:", e)
            const resError = setErrorInCreateProperty(e);
            setAlertModalData({type: "error", message: resError});
        }

        setLoading(false);
    };

    return (
        <div className={"space-y-12"}>
            <AlertModal
                {...alertModalData}
                isOpen={isOpenAlertModal}
                setData={setAlertModalData}
                setIsOpen={setIsOpenAlertModal}
            />
            <h3>افزودن ملک جدید</h3>

            {/* image property form */}
            <ImagesForm
                successCreate={successCreate}
                setSuccessCreate={setSuccessCreate}
                refData={imagesFormData}
            />

            {/* data property form */}
            <CreatePropertyForm
                successCreate={successCreate}
                onSubmit={createPropertyHandler}
                isLoading={loading}
            />
        </div>
    );
};