import {Suspense} from 'react'
import Loading from "@components/ui/Loading";

export default function SuspenseBoundary({children, fallback}) {
    return (
        <Suspense fallback={fallback || <Loading msg={"در حال بارگذاری"}/>}>
            {children}
        </Suspense>
    )
};