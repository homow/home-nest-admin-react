import {useState} from "react";
import Button from "@components/ui/Button";
import Input from "@components/ui/forms/Input";
import CheckBox from "@components/ui/forms/CheckBox";
import {RedStarField} from "@components/ui/Fragments";
import {formatPriceDebounced} from "@/lib/utils/helper.js";

export default function CreatePropertyForm({onSubmit, isLoading}) {
    const [formData, setFormData] = useState({
        title: "",
        category: "sale",
        price: "",
        price_with_discount: "",
        description: "",
        province_and_city: "",
        address: "",
        features: [],
        discount_until: "",
        tags: "",
        stock: 1,
        metadata: "",
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleFeatureToggle = feature => {
        // noinspection JSCheckFunctionSignatures
        setFormData(prevState => ({
            ...prevState,
            features: prevState.features.includes(feature)
                ? prevState.features.filter(f => f !== feature)
                : [...prevState.features, feature]
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (onSubmit) onSubmit(formData);
    };

    const availableFeatures = [
        "بالکن", "پارکینگ", "آسانسور", "انبار", "استخر"
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            <div className={"space-y-8 @6xl/main:grid grid-cols-2 gap-x-4"}>
                {/* title and id */}
                <div className={"multi-inputs-style"}>
                    {/* title */}
                    <Input
                        label="عنوان ملک"
                        name="title"
                        autoComplete="title"
                        value={formData.title}
                        onChange={event => handleChange("title", event.target.value)}
                        placeholder="مثلاً آپارتمان نوساز"
                        req={true}
                    />

                    {/* id */}
                    <Input
                        autoComplete="property_number"
                        label="شناسه ملک (اختیاری)"
                        name="property_number"
                        value={formData.property_number || ""}
                        onChange={event => handleChange("property_number", event.target.value)}
                        placeholder="مثلاً A-1234"
                    />
                </div>

                {/* category and price */}
                <div className={"multi-inputs-style"}>
                    {/* category */}
                    <div>
                        <label htmlFor={"category"} className="flex flex-row gap-1 text-sm font-medium mb-1">دسته بندی <RedStarField/></label>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={e => handleChange("category", e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 text-secondary-txt bg-primary-bg/40 px-4 py-2 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                        >
                            <option className={"text-secondary-txt bg-main-bg aria-selected:bg-violet-500"} value="sale">فروش</option>
                            <option className={"text-secondary-txt bg-main-bg aria-selected:bg-violet-500"} value="rent">رهن</option>
                        </select>
                    </div>

                    {/* price */}
                    <Input
                        label="قیمت به تومان (اگر وارد نکنید، توافقی میشه)"
                        name="price"
                        type="text"
                        autoComplete="price"
                        value={formData.price}
                        onChange={event => {
                            handleChange("price", event.target.value);
                            formatPriceDebounced(event, handleChange, "price");
                        }}
                        placeholder="مثلاً 1,200,000,000"
                        req={true}
                    />
                </div>

                {/* price with discount and discount date */}
                <div className={"multi-inputs-style"}>

                    {/* price with discount */}
                    <Input
                        autoComplete="price_with_discount"
                        label="قیمت با تخفیف (اختیاری)"
                        name="price_with_discount"
                        type="text"
                        value={formData.price_with_discount}
                        onChange={event => {
                            handleChange("price_with_discount", event.target.value);
                            formatPriceDebounced(event, handleChange, "price_with_discount");
                        }}
                        placeholder="مثلاً 1,100,000,000"
                    />

                    {/* discount date */}
                    <Input
                        label="تاریخ پایان تخفیف (اختیاری)"
                        name="discount_until"
                        type="datetime-local"
                        value={formData.discount_until}
                        onChange={(event) => handleChange("discount_until", event.target.value)}
                    />
                </div>

                {/* province and city */}
                <div className={'multi-inputs-style'}>

                    {/* province_and_city */}
                    <Input
                        autoComplete="province_and_city"
                        label="استان و شهر"
                        name="province_and_city"
                        value={formData.province_and_city}
                        onChange={(event) => handleChange("province_and_city", event.target.value)}
                        placeholder="مثلاً فارس، شیراز"
                        req={true}
                    />

                    {/* city */}
                    <Input
                        label="آدرس"
                        name="address"
                        autoComplete="address"
                        value={formData.address}
                        onChange={(event) => handleChange("address", event.target.value)}
                        placeholder="مثلا: خیابان قصردشت، کوچه 53، پلاک 10"
                        req={true}
                    />
                </div>
            </div>

            {/* tags, description, metaData, features */}
            <div className={"space-y-6 @5xl/main:flex flex-row @5xl/main:*:w-full gap-4 items-start"}>

                {/* description and features */}
                <div className={"space-y-6"}>

                    {/* description */}
                    <div>
                        <label
                            htmlFor="description"
                            className={"flex flex-row gap-1 text-sm font-medium"}
                        >
                            توضیحات
                            <RedStarField/>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            cols="30"
                            rows="8"
                            value={formData.description}
                            onChange={v => handleChange("description", v.target.value)}
                            placeholder="مثلاً طبقه دوم، ۲ خوابه، دارای استخر و چند حمام مجزا و . . ."
                            className={"mt-1 block w-full rounded-lg border border-gray-300 bg-primary-bg/40 px-4 py-2 placeholder-secondary-txt focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"}
                        >
                        </textarea>
                    </div>
                </div>

                {/* tags and metadata */}
                <div className={"grid grid-cols-1 gap-6 @3xl/main:grid-cols-2 @5xl/main:flex @5xl/main:flex-col"}>

                    {/* advanced information (metaData) */}
                    <Input
                        label="اطلاعات اضافی (هر ویژگی را با '،' جدا کنید)"
                        name="metadata"
                        value={formData.metadata}
                        onChange={event => handleChange("metadata", event.target.value)
                        }
                        placeholder="مثلاً  فضای پارکینگ = دو ماشین، سقف = 3متر"
                    />

                    {/* tags */}
                    <Input
                        label="برچسب‌ها (با کاما '،' جدا کنید)"
                        name="tags"
                        value={formData.tags}
                        onChange={event => handleChange("tags", event.target.value)}
                        placeholder="مثلاً: نوساز، غرب_تهران"
                    />

                    {/* features and stock */}
                    <div className={"flex flex-col items-start gap-4 divide-y divide-secondary-txt @xl/main:divide-y-0 @xl/main:divide-x @xl/main:flex-row @xl/main:items-start @3xl/main:col-span-2"}>
                        {/* features */}
                        <div>
                            <p className="flex flex-row gap-1 text-sm font-medium mb-2">
                                ویژگی‌ها (حداقل یکی)
                                <RedStarField/>
                            </p>
                            <div className="flex items-center flex-wrap gap-3 pb-4 @xl/main:last:pl-4">
                                {availableFeatures.map(feature => (
                                    <CheckBox
                                        key={feature}
                                        id={feature}
                                        label={feature}
                                        onChange={() => handleFeatureToggle(feature)}
                                        checked={formData.features.includes(feature)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* stock */}
                        <div>
                            <p className={"flex flex-row gap-1 text-sm font-medium mb-2"}>
                                موجودی
                                <RedStarField/>
                            </p>
                            <CheckBox
                                id={"stock"}
                                checked={formData.stock === 1}
                                onChange={() => handleChange("stock", formData.stock === 1 ? 0 : 1)}
                                label={"در دسترس است"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* submit */}
            <Button
                disabled={isLoading}
                text={isLoading ? "در حال ارسال..." : "ثبت ملک"}
                type={"submit"}
            />
        </form>
    );
};
