import {Suspense} from 'react'

export default function SuspenseBoundary({children, fallback}) {
    return (
        <Suspense fallback={fallback || <p className="font-medium text-secondary-txt text-xl text-center mt-4 p-4">در حال بارگذاری...</p>}>
            {children}
        </Suspense>
    )
};