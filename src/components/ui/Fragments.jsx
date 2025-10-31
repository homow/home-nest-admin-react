import {cn} from "@/lib/utils/ui-utils.js";

const RedStarField = () => {
    return <span className={"inline-block max-h-5 text-xl text-rose-600"}>*</span>;
}

const ErrorMessageInputs = ({msg = ""}) => {
    return (
        <p
            className={cn("font-medium text-sm text-rose-600 dark:text-rose-500", msg ? "block" : "hidden")}
        >
            {msg}
        </p>
    )
}

export {RedStarField, ErrorMessageInputs}