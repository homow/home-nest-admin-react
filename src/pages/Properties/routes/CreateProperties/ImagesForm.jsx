import Input from "@components/ui/forms/Input";

export default function ImagesForm() {
    const submitHandler = event => {
        event.preventDefault();
    }

    return (
        <form onSubmit={submitHandler}>
            {/* images */}
            <div className={"multi-inputs-style"}>

                {/* main_images */}
                <Input
                    type={"file"}
                    label="تصویر اصلی"
                    name="main_image"
                    inputProps={{dir: "ltr", accept: "image/*"}}
                />

                {/* images */}
                <Input
                    type={"file"}
                    label="تصاویر بیشتر(حداکثر 3)"
                    inputProps={{dir: "ltr", multiple: true, accept: "image/*"}}
                    name="images"
                />
            </div>
        </form>
    )
}
