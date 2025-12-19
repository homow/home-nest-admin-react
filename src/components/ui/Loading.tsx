type Props = {
    msg?: string;
}

export default function Loading(
    {
        msg = "لطفاً صبر کنید..."
    }: Props
) {
    return (
        <div
            className="flex items-center justify-center"
            role="status"
            aria-live="polite"
        >
            <div
                className="flex flex-col items-center gap-4"
            >
                {/* Spinner */}
                <div
                    className="w-16 h-16 border-4 border-t-violet-500 border-gray-300 rounded-full animate-spin"
                />
                {/* Message */}
                <p
                    className="text-lg font-medium"
                >
                    {msg}
                </p>
            </div>
        </div>
    );
};