import Icon from "@ui/icons/Icon";
import type {PrimaryProps} from "@/types/button.types";

export default function ButtonContent(
    {
        rightIcon,
        leftIcon,
        loading,
        text,
        textStyle
    }: PrimaryProps
) {
    return (
        <>
            {(rightIcon && !loading) && <Icon icon={rightIcon}/>}
            <span>
                {loading ? (
                    <Icon
                        icon="loadingDoted"
                        className="animate-spin [animation-duration:2s]"
                    />
                ) : (
                    <span className={textStyle}>{text}</span>
                )}
            </span>
            {(leftIcon && !loading) && <Icon icon={leftIcon}/>}
        </>
    );
};