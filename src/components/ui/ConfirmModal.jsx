export default function ConfirmModal({isOpen, message, title = "تأیید", onConfirm, onCancel, dangerMode = false, z = "z-30"}) {

    const confirmBtnBg = dangerMode
        ? "bg-red-600 hover:bg-red-800"
        : "bg-green-600 hover:bg-green-800";

    const cancelBtnBg = dangerMode
        ? "bg-green-600 hover:bg-green-800"
        : "bg-red-600 hover:bg-red-800";

    const modalHeaderColor = dangerMode ? "text-red-500" : "text-green-500";

    return (
        <div
            className={`text-sm sm:text-base px-4 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-md w-full flex items-center justify-center shadow-custom ${z} ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 space-y-6">
                <h3 className={`text-lg font-semibold ${modalHeaderColor}`}>{title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            onCancel();
                        }}
                        className={`cursor-pointer px-4 py-1.5 rounded-lg text-white ${cancelBtnBg} transition`}
                    >
                        لغو
                    </button>
                    <button
                        onClick={() => {
                            onConfirm?.();
                        }}
                        className={`cursor-pointer px-4 py-1.5 rounded-lg text-white ${confirmBtnBg} transition`}
                    >
                        تأیید
                    </button>
                </div>
            </div>
        </div>
    );
}
