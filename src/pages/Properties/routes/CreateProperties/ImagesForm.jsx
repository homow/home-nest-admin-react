import {useEffect, useState, useRef} from "react";
import Input from "@components/ui/forms/Input";
import AlertModal from "@components/ui/modals/AlertModal";

export default function ImagesForm({formRef, refData}) {
    const [mainFile, setMainFile] = useState(null);
    const [otherFiles, setOtherFiles] = useState([]);
    const [mainPreview, setMainPreview] = useState("");
    const [othersPreview, setOthersPreview] = useState([]);
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const [alertModalData, setAlertModalData] = useState({});
    const otherFilesRef = useRef(null);

    // handle main image
    const handleMainChange = event => {
        const file = event.target.files?.[0];
        setMainFile(file);

        if (file) {
            setMainPreview(URL.createObjectURL(file));
        } else {
            setMainPreview("");
        }
    };

    // handle other images
    const handleOthersChange = event => {
        const files = Array.from(event.target.files || []);

        if (files.length > 3) {
            setAlertModalData({type: "error", message: "تعداد تصاویر باید حداکثر 3 عدد باشد"});
            setIsOpenAlertModal(true);
            otherFilesRef.current.value = "";
            setOtherFiles([]);
            setOthersPreview([])
        } else {
            setOtherFiles(files);
            setOthersPreview(files.map(f => URL.createObjectURL(f)));
        }
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

            {/* alert modal */}
            <AlertModal isOpen={isOpenAlertModal} setIsOpen={setIsOpenAlertModal} setData={setAlertModalData} {...alertModalData}/>

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
                    label="تصاویر بیشتر(حداکثر 3)"
                    dir={"ltr"}
                    accept={"image/*"}
                    multiple={true}
                    ref={otherFilesRef}
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