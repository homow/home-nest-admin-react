export default function Loading() {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary-bg/90 backdrop-blur-sm"
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 border-8 border-gray-300 border-t-violet-500 rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                    لطفاً صبر کنید...
                </p>
            </div>
        </div>
    );
};