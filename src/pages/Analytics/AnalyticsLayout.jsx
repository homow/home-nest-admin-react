import {Link} from 'react-router-dom';

export default function AnalyticsLayout() {
    return (
        <section>
            <h1>آنالیز</h1>
            <Link to={"/analytics/properties"}>ملک ها</Link>
        </section>
    )
}
