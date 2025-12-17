import {useState} from "react";

interface Props {
    initialValue?: boolean;
}

function useToggle({initialValue = false}: Props = {}) {
    const [toggle, setToggle] = useState(initialValue);

    function handleToggle(value?: boolean): void {
        if (typeof value === "boolean") {
            setToggle(value);
        } else {
            setToggle((prev: boolean) => !prev);
        }
    }

    return {toggle, setToggle, handleToggle};
}

export default useToggle;