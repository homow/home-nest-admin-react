import {useEffect, useState, useRef} from "react";
import ImagesForm from "./ImagesForm";
import CreatePropertyForm from "./CreatePropertyForm";
import AlertModal from "@ui/modals/AlertModal";
import {createProperty, uploadPropertyImages} from "@api/requests/properties.js"
import {fixPropertyData} from "@api/api-utils.ts"
import {setErrorInCreateProperty} from "@api/error-handler/property.js";

export default function CreateProperty() {
    const [loading, setLoading] = useState(false);
    const [successCreate, setSuccessCreate] = useState(false);
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const [alertModalData, setAlertModalData] = useState({});
    const imagesFormData = useRef(new FormData());

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
            // post request to create property api
            const propertyRes = await createProperty(dataProperty);

            if (propertyRes?.data?.ok) {
                // check if images is exist and valid.
                const arr = Array.from(imagesFormData.current);
                const isValidFiles = Array.isArray(arr) && arr.length > 0 && arr.every(f => f[1] instanceof File);

                if (isValidFiles) {
                    imagesFormData.current.append("property_id", propertyRes?.data?.property?.id);

                    try {
                        const imgRes = await uploadPropertyImages(imagesFormData.current);

                        if (imgRes?.status === "ok") {
                            setSuccessCreate(true);
                            openAlertModal({type: "success", message: "محصول و تصاویر با موفقیت اضافه شدن."});
                        }
                        console.log("imgRes else:", imgRes);

                    } catch (e) {
                        console.log("not ok img:", e);
                        openAlertModal({type: "warning", message: "محصول اضافه اما تصاویر نشدن."});
                        setLoading(false);
                        return;
                    }

                } else {
                    setSuccessCreate(true);
                    openAlertModal({type: "success", message: "محصول با موفقیت اضافه شد."});
                }

            }

        } catch (e) {
            openAlertModal({type: "error", message: "محصول اضافه نشد."});
            console.log("e on pr:", e);
            const resError = setErrorInCreateProperty(e);
            setAlertModalData({type: "error", message: resError});
            setLoading(false);
            return;
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
                setSuccessCreate={setSuccessCreate}
                successCreate={successCreate}
                onSubmit={createPropertyHandler}
                isLoading={loading}
            />
        </div>
    );
};