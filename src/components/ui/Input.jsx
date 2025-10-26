export default function Input({onChange, name, label, value, placeholder, id, props}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium">{label}</label>
            <input
                {...props}
                dir={"ltr"}
                value={value}
                onChange={event => onChange(event.target.value)}
                name={name}
                autoComplete={name}
                type={name}
                id={id}
                placeholder={placeholder}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
            />
        </div>
    )
}
