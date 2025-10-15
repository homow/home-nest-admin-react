import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {createColumnHelper} from "@tanstack/react-table";

const cn = (...inputs) => twMerge(clsx(inputs));
const columnHelper = createColumnHelper();

export {cn, columnHelper};
