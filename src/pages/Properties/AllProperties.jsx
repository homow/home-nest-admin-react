import Button from "@ui/Button";
import {getProperty} from "@api/requests/properties.js";
import {useState} from "react";

export default function AllProperties() {
    const [loading, setLoading] = useState(false);

    const getPropertyHandler = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const res = await getProperty();
            console.log(res.data);
        } catch (e) {
            console.log(e);
        }

        setLoading(false);
    }

    return (
        <div>
            <Button
                loading={loading}
                disabled={loading}
                onClick={getPropertyHandler}
                text={"گرفتن ملک ها"}
            />
        </div>
    )
}
