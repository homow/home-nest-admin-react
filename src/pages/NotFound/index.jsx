import {Link} from "react-router-dom";

export default function NotFound() {
    return (
        <section className={"min-h-screen flex items-center justify-center flex-col gap-6"}>
            <h1>404 | صفحه پیدا نشد</h1>
            <Link to={"/"} className={"text-violet-500"}>بازگشت</Link>
        </section>
    )
}
