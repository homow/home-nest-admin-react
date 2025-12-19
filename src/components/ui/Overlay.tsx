import {cn} from "@utils/ui-utils";

type ZNumber = 0 | 10 | 20 | 30 | 40 | 50;
type ZIndex = `z-${ZNumber}`;

interface Props {
    flag: boolean;
    setFlag: (flag?: boolean) => void;
    z: ZIndex;
    lock: boolean;
}

export default function Overlay(
    {
        flag,
        setFlag,
        z = "z-10",
        lock = false
    }: Props
) {
    if (!flag) return null;

    function clickHandler() {
        if (lock) return;
        setFlag(false);
    }

    return (
        <div
            onClick={clickHandler}
            className={
                cn(
                    "fixed inset-0 bg-black/60 w-full h-full backdrop-blur-xs",
                    z
                )
            }
        >
        </div>
    );
};