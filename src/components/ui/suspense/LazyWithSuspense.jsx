import {lazy} from "react";
import SuspenseBoundary from './SuspenseBoundary'

const LazyWithSuspense = (importFunc, className) => {
    const Component = lazy(importFunc);

    return props => (
        <SuspenseBoundary className={className}>
            <Component {...props}/>
        </SuspenseBoundary>
    );
};

export default LazyWithSuspense;