import {cn} from "@utils/ui-utils.js";

const RedStarField = () => {
    return <span className={"inline-block max-h-5 text-xl text-rose-600"}>*</span>;
}

const ErrorMessageInputs = ({cls, msg = ""}) => {
    return (
        <p className={cn("mt-2 font-medium text-sm text-rose-600 dark:text-rose-500", msg ? "block" : "hidden", cls)}>
            {msg}
        </p>
    )
}

export {RedStarField, ErrorMessageInputs}