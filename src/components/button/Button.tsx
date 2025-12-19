import {Link} from "react-router";
import ButtonContent from "./ButtonContent";
import buttonStyle from "@utils/button-helper";
import type {Props} from "@/types/button.types";

function Button(
    {
        as = "button",
        url,
        btnStyle,
        text,
        textStyle,
        className,
        buttonType = "button",
        rightIcon,
        leftIcon,
        disabled,
        loading,
        onClick,
        btnRef,
        linkRef
    }: Props) {

    const classNames: string = buttonStyle({
        btnStyle,
        className,
        loading,
        disabled
    });

    if (as === "link") {
        return (
            <Link
                ref={linkRef}
                to={url as string}
                className={classNames}
                aria-disabled={disabled}
                aria-busy={loading ? "true" : "false"}
            >
                <ButtonContent
                    loading={loading}
                    text={text}
                    rightIcon={rightIcon}
                    leftIcon={leftIcon}
                    textStyle={textStyle}
                />
            </Link>
        );
    } else if (as === "a") {
        return (
            <a
                rel={"noopener noreferrer"}
                ref={linkRef}
                href={url}
                className={classNames}
                aria-disabled={disabled}
                aria-busy={loading ? "true" : "false"}
            >
                <ButtonContent
                    loading={loading}
                    text={text}
                    rightIcon={rightIcon}
                    leftIcon={leftIcon}
                    textStyle={textStyle}
                />
            </a>
        );
    } else {
        return (
            <button
                type={buttonType}
                disabled={disabled}
                className={classNames}
                onClick={onClick}
                ref={btnRef}
            >
                <ButtonContent
                    loading={loading}
                    text={text}
                    rightIcon={rightIcon}
                    leftIcon={leftIcon}
                    textStyle={textStyle}
                />
            </button>
        );
    }
}

export default Button;