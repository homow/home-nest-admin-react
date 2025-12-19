import type {RefObject} from "react";

type BaseProps = {
    loading?: boolean;
}

interface PropsStyle extends BaseProps {
    btnStyle: "fill" | "outline" | "sharpL" | "sharpR" | "sharpBoth" | "sharpNone" | "primary";
    className?: string;
    disabled?: boolean;
}

interface PrimaryProps extends BaseProps {
    rightIcon?: string;
    leftIcon?: string;
    text?: string;
    textStyle?: string;
}

type InitType = PropsStyle & PrimaryProps;

interface ButtonProps extends InitType {
    as: "button";
    buttonType?: "button" | "submit" | "reset";
    url?: never;
    onClick?: () => void;
    btnRef?: RefObject<HTMLButtonElement | null>;
    linkRef?: never;
}

interface LinkProps extends InitType {
    as: "link" | "a";
    url: string;
    buttonType?: never;
    onClick?: never;
    linkRef?: RefObject<HTMLAnchorElement | null>;
    btnRef?: never;
}

type Props = ButtonProps | LinkProps;

export type {Props, PropsStyle, PrimaryProps};