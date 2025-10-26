import {Suspense} from 'react'

function SuspenseCallback() {
    return <p className="font-medium text-secondary-txt text-2xl text-center mt-20 p-4">در حال بارگذاری...</p>
}

export default function SuspenseBoundary({children, fallback}) {
    return (
        <Suspense fallback={fallback || <SuspenseCallback/>}>
            {children}
        </Suspense>
    )
};