import {useState} from "react";
import Input from "@components/ui/forms/Input";
import AlertModal from "@components/ui/modals/AlertModal";

export default function ImagesForm() {
    const [mainFile, setMainFile] = useState(null);
    const [otherFiles, setOtherFiles] = useState([]);
    const [mainPreview, setMainPreview] = useState("");
    const [othersPreview, setOthersPreview] = useState([]);
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const [alertModalData, setAlertModalData] = useState({});

    // handle main image
    const handleMainChange = event => {
        const file = event.target.files?.[0];
        setMainFile(file);
        if (file) setMainPreview(URL.createObjectURL(file));
        else setMainPreview("");
    };

    // handle other images
    const handleOthersChange = event => {
        const files = Array.from(event.target.files || []);
        console.log(files);
        if (files.length > 2) {
            console.log("ok")
            setAlertModalData({type: "error", message: "تعداد تصاویر باید کمتر از 3 عدد باشد"});
            setIsOpenAlertModal(true);
        } else {
            setOtherFiles(files);
            setOthersPreview(files.map(f => URL.createObjectURL(f)));
        }
    };

    const getAllFiles = () => {
        const arr = [];
        if (mainFile) arr.push({main_image: true, file: mainFile});
        otherFiles.forEach(f => arr.push({main_image: false, file: f}));
        return arr;
    };

    const submitHandler = event => {
        event.preventDefault();
        console.log(getAllFiles());
    }

    return (
        <form onSubmit={submitHandler}>

            {/* alert modal */}
            <AlertModal isOpen={isOpenAlertModal} setIsOpen={setIsOpenAlertModal} setData={setAlertModalData} {...alertModalData}/>

            {/* images */}
            <div className={"multi-inputs-style"}>

                {/* main_images */}
                <Input
                    type={"file"}
                    label="تصویر اصلی"
                    name="main_image"
                    inputProps={{dir: "ltr", accept: "image/*"}}
                    onChange={handleMainChange}
                />

                {/* images */}
                <Input
                    type={"file"}
                    label="تصاویر بیشتر(حداکثر 3)"
                    inputProps={{dir: "ltr", multiple: true, accept: "image/*"}}
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
            <button type={"submit"}>submit</button>
        </form>
    )
};