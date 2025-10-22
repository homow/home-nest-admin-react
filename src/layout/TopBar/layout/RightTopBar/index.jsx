import OpenMobileNavMenuBtn from "./OpenMobileNavMenuBtn.jsx";

export default function Index({setMobileNavOpen}) {
    return (
        <div className={"md:hidden"}>
            <OpenMobileNavMenuBtn setMobileNavOpen={setMobileNavOpen}/>
        </div>
    )
}
