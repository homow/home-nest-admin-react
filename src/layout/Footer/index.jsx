function FooterCopyright() {
    return (
        <div>
            توسعه داده شده با ❤️ توسط <a target="_blank" href="https://card.homow.ir" className={"text-sky-500"}>homow</a>
        </div>
    )
}

function FooterLinks() {
    return (
        <div className={"flex flex-row flex-wrap-reverse items-center justify-center gap-2 xs:gap-4 md:justify-end"}>
            <a target="_blank" href="https://github.com/homow" className={"text-sky-500"}>گیتهاب</a>
            <a target="_blank" href="https://homow.ir" className={"text-sky-500"}>وبسایت</a>
            <a target="_blank" href="https://youtube.com/@homow_dev" className={"text-sky-500"}>یوتیوب</a>
            <a target="_blank" href="https://t.me/homow_dev" className={"text-sky-500"}>تلگرام</a>
        </div>
    )
}

export default function Index() {
    return (
        <footer id="footer" className={`flex flex-col gap-4 w-full justify-between py-4 bg-primary-bg text-[13px] xs:text-sm text-center md:flex-row md:text-start 2xl:text-base`}>
            <FooterLinks/>
            <FooterCopyright/>
        </footer>
    )
}
