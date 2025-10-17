import {useLocation} from "react-router-dom"

export default function useIsExactRoute(targetPath) {
    const {pathname} = useLocation()
    console.log(pathname)
    return pathname === targetPath
}