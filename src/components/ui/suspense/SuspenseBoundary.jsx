import {Suspense} from 'react'
import Loading from "../Loading.tsx";

export default function SuspenseBoundary({children, fallback, className}) {
    return (
        <Suspense fallback={fallback || <Loading className={className} msg={"در حال بارگذاری"}/>}>
            {children}
        </Suspense>
    )
};