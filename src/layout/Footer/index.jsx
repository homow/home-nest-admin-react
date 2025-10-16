function FooterCopyright() {
    return (
        <div>
            توسعه داده شده با ❤️ توسط <a target="_blank" href="https://card.homow.ir" className={"text-violet-500"}>homow</a>
        </div>
    )
}

function FooterLinks() {
    return (
        <div className={"flex flex-row flex-wrap-reverse items-center justify-center gap-2 xs:gap-4 md:justify-end *:text-violet-500"}>
            <a target="_blank" href="https://github.com/homow">گیتهاب</a>
            <a target="_blank" href="https://homow.ir">وبسایت</a>
            <a target="_blank" href="https://youtube.com/@homow_dev">یوتیوب</a>
            <a target="_blank" href="https://t.me/homow_dev">تلگرام</a>
        </div>
    )
}

export default function Index() {
    return (
        <footer id="footer" className={`flex flex-col gap-4 w-full justify-between py-4 bg-primary-bg text-sm text-center md:flex-row md:text-start 2xl:text-base`}>
            <FooterCopyright/>
            <FooterLinks/>
        </footer>
    )
}
