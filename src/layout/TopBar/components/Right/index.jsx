function OpenMobileNavMenuBtn({setMobileNavOpen}) {
    return (
        <span
            onClick={
                () => {
                    setMobileNavOpen(true);
                }}
            className={"cursor-pointer md:hidden"}
        >
            <svg className={"size-6 -scale-x-100"}>
                <use href="#bars-icon"></use>
            </svg>
        </span>
    )
}

export default function Index({setMobileNavOpen}) {
    return (
        <div className={"md:hidden"}>
            <OpenMobileNavMenuBtn setMobileNavOpen={setMobileNavOpen}/>
        </div>
    )
}
