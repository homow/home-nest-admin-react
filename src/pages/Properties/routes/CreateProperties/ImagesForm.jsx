import {useState} from "react";
import Input from "@components/ui/forms/Input";
import AlertModal from "@components/ui/modals/AlertModal";

export default function ImagesForm(propertyID) {
    const [mainPreview, setMainPreview] = useState("");
    const [othersPreview, setOthersPreview] = useState([]);
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const [alertModalData, setAlertModalData] = useState({type: "error", message: ""});

    const submitHandler = async event => {
        event.preventDefault();
        setIsOpenAlertModal(false);
        setAlertModalData({type: "error", message: ""});

        try {
            const form = event.target;
            const mainFile = form.elements["main_image"]?.files[0] ?? null;
            const otherFiles = form.elements["images"]?.files ?? null;
            const commonOpts = {property_id: propertyID}
            const results = [];

            if (mainFile) {
                // const res = await uploadSingle(mainFile, {...commonOpts, is_main: true});
                // results.push(res);
            }
            if (otherFiles && otherFiles.length) {
                // const res = await uploadMultiple(otherFiles, {...commonOpts, is_main: false});
                // results.push(res);
            }
            setAlertModalData({type: "success", message: "آپلود شد"});
            console.log(results);

        } catch (err) {
            console.log(err)
            setAlertModalData({type: "error", message: err?.response?.data?.error || err.message || 'خطا در آپلود'});
            setIsOpenAlertModal(true);
        }
    };

    const handleMainChange = event => {
        console.log(event.target.files)
        const f = event.target.files?.[0];
        if (f) setMainPreview(URL.createObjectURL(f));
        else setMainPreview("");
    };

    const handleOthersChange = event => {
        console.log(event.target.files)
        const files = Array.from(event.target.files || []);
        console.log(files);
        setOthersPreview(files.map(f => URL.createObjectURL(f)));
    };

    return (
        <>
            <AlertModal
                isOpen={isOpenAlertModal}
                setIsOpen={setIsOpenAlertModal}
                {...alertModalData}
            />
            <form onSubmit={submitHandler}>
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
                                {othersPreview.map((u, i) => <img key={i} src={u} alt={`preview ${i}`} className={"size-30 object-cover"}/>)}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </>
    )
};