import {cn} from "@/lib/utils/ui-utils.js";
import {RedStarField} from "@components/ui/Fragments";

export default function Input({onChange, name, type = name, id = name, label, autoComplete = null, value, placeholder, req, inputProps, className = null, parentClassName = null, children}) {
    return (
        <div className={cn(parentClassName)}>
            <label htmlFor={id} className="flex flex-row gap-1 text-sm">{label} {req && <RedStarField/>}</label>
            <input
                {...inputProps}
                {...(type !== "file" && {value: value ?? ""})}
                onChange={onChange}
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={
                    cn("mt-1 block bg-primary-bg/40 w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-secondary-txt focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition",
                        className
                    )}
            />
            {children}
        </div>
    )
}
