import {cn} from "@utils/ui-utils";

interface Props {
    cls?: string;
    msg?: string;
}

function RedStarField() {
    return <span
        className={
            "inline-block max-h-5 text-xl text-rose-600"
        }
    >
        *
    </span>;
}

function ErrorMessageInputs(
    {
        cls,
        msg = ""
    }: Props
) {
    return (
        <p
            className={
                cn(
                    "mt-2 font-medium text-sm text-rose-600 dark:text-rose-500",
                    msg ? "block" : "hidden",
                    cls
                )
            }
        >
            {msg}
        </p>
    );
}

export {RedStarField, ErrorMessageInputs}