import {cn} from "@/lib/utils/ui-utils.js";

export default function Input({onChange, name, type = name, autoComplete = name, id = name, label = name, value, placeholder, props, className = null}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium">{label}</label>
            <input
                {...props}
                value={value}
                onChange={
                    event => {
                        onChange(event.target.value)
                    }
                }
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={cn("mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition", className && className)}
            />
        </div>
    )
}
