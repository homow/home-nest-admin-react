import {useNavigate} from "react-router-dom";
import Button from "@components/ui/Button";

export default function NotFound() {
    const navigate = useNavigate();
    const hasBackPath = window.history.length;

    const goBack = () => navigate(-1);
    const goHome = () => navigate("/");

    return (
        <section className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
            <h1 className="text-5xl font-bold text-rose-500">404</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
                صفحه‌ای که دنبال آن بودید پیدا نشد
            </p>
            <div className="flex gap-4 mt-4">
                <Button
                    text={hasBackPath > 1 ? "بازگشت به صفحه قبل" : "بازگشت به خانه"}
                    onClick={hasBackPath > 1 ? goBack : goHome}
                    className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
                />
            </div>
        </section>
    )
}
