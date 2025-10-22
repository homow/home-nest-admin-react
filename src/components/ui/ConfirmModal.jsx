export default function ConfirmModal({isOpen, message, title = "تأیید", onConfirm, onCancel, dangerMode = false, z = "z-30"}) {

    const confirmBtnBg = dangerMode
        ? "bg-red-500 hover:bg-red-600"
        : "bg-green-500 hover:bg-green-600";

    const cancelBtnBg = dangerMode
        ? "bg-green-500 hover:bg-green-600"
        : "bg-red-500 hover:bg-red-600";

    const modalHeaderColor = dangerMode ? "text-red-500" : "text-green-500";

    return (
        <div
            className={`fixed top-1/2 -translate-y-1/2 right-0 left-0 flex items-center justify-center shadow-custom ${z} ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
                <h3 className={`text-lg font-semibold ${modalHeaderColor}`}>{title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            onCancel();
                        }}
                        className={`cursor-pointer px-3 py-1 rounded-lg text-white ${cancelBtnBg} transition`}
                    >
                        لغو
                    </button>
                    <button
                        onClick={() => {
                            onConfirm?.();
                        }}
                        className={`cursor-pointer px-3 py-1 rounded-lg text-white ${confirmBtnBg} transition`}
                    >
                        تأیید
                    </button>
                </div>
            </div>
        </div>
    );
}
