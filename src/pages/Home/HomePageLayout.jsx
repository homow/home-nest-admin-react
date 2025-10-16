import logo from "@img/logo.webp"

export default function HomePageLayout() {
    return (
        <div className={"main-components"}>
            <div className={"flex flex-row items-end gap-4"}>
                <img className={"size-15"} src={`${logo}`} alt="logo"/>
                <h1>پنل مدیریت آشیانه</h1>
            </div>
        </div>
    )
}