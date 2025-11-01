import {useEffect, useState} from "react";
import Input from "@components/ui/forms/Input";
import AlertModal from "@components/ui/modals/AlertModal";

export default function ImagesForm({formRef, refData}) {
    const [mainFile, setMainFile] = useState(null);
    const [otherFiles, setOtherFiles] = useState([]);
    const [mainPreview, setMainPreview] = useState("");
    const [othersPreview, setOthersPreview] = useState([]);
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const [alertModalData, setAlertModalData] = useState({});
    const maxSizeMB = 3;

    // handle main image
    const handleMainChange = event => {
        const file = event.target.files?.[0];
        setMainFile(file);

        if (file && file.size / 1024 / 1024 > maxSizeMB) {
            setAlertModalData({type: "warning", message: "سایز تصویر باید کمتر از 3 مگابایت باشد."});
            setIsOpenAlertModal(true);
            event.target.value = "";
            setMainFile(null);
            setMainPreview("");
            return;
        }
        setMainFile(file);
        setMainPreview(file ? URL.createObjectURL(file) : "");

    };

    // handle other images
    const handleOthersChange = event => {
        const resetFiles = message => {
            setAlertModalData({type: "warning", message});
            setIsOpenAlertModal(true);
            setOtherFiles([]);
            setOthersPreview([]);
            event.target.value = "";
        };

        const files = Array.from(event.target.files || []);

        if (files.length > 2) {
            resetFiles("تعداد تصاویر باید حداکثر 2 عدد باشد")
            return;
        }

        for (const f of files) {
            if (f.size / 1024 / 1024 > maxSizeMB) {
                resetFiles("سایز تصویر باید کمتر از 3 مگابایت باشد.")
                return;
            }
        }

        setOtherFiles(files);
        setOthersPreview(files.map(f => URL.createObjectURL(f)));
    };

    useEffect(() => {
        const formData = new FormData();

        if (mainFile) {
            formData.append("main_image", mainFile);
        }

        if (otherFiles.length > 0) {
            otherFiles.forEach(f => formData.append("images", f));
        }

        refData.current = formData;
    }, [mainFile, otherFiles, refData]);

    const submitHandler = event => event.preventDefault();

    return (
        <form ref={formRef} onSubmit={submitHandler}>
            <h4 className={"mb-4 text-amber-500"}>
                توجه: سایز هر تصویر باید زیر 3 مگابایت باشه
            </h4>
            {/* alert modal */}
            <AlertModal
                isOpen={isOpenAlertModal}
                setIsOpen={setIsOpenAlertModal}
                setData={setAlertModalData} {...alertModalData}
            />

            {/* images */}
            <div className={"multi-inputs-style"}>

                {/* main_images */}
                <Input
                    type={"file"}
                    label="تصویر اصلی"
                    name="main_image"
                    dir={"ltr"}
                    accept={"image/*"}
                    onChange={handleMainChange}
                />

                {/* images */}
                <Input
                    type={"file"}
                    label="تصاویر بیشتر(حداکثر 2)"
                    dir={"ltr"}
                    accept={"image/*"}
                    multiple={true}
                    name="images"
                    onChange={handleOthersChange}
                />
            </div>

            <div className={"flex flex-wrap gap-2 justify-between items-center"}>
                <div className={"max-w-60 mt-6"}>
                    {mainPreview && <img
                        src={`${mainPreview}`}
                        alt="main preview"
                        className={"w-full"}/>
                    }
                </div>

                <div>
                    {othersPreview.length > 0 && (
                        <div className={"flex flex-wrap gap-8 mt-8"}>
                            {othersPreview.map((url, index) => <img key={url} src={url} alt={`preview ${index}`} className={"size-30 object-cover"}/>)}
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
};