import {useState} from "react";
import Input from "@components/ui/forms/Input.jsx";
import {cn} from "@/lib/utils/ui-utils.js";
import CheckBox from "@components/ui/forms/CheckBox.jsx";

export default function CreatePropertyForm({onSubmit, isLoading}) {
    /** @type {{title: string, category: string, price: string, description: string, province: string, city: string, features: string[], price_with_discount: string, discount_until: string, main_image: string, tags: string, stock: number}} */
    const [formData, setFormData] = useState({
        title: "",
        category: "sale",
        price: 0,
        description: "",
        province: "",
        city: "",
        /** @type {string[]} */
        features: [],
        price_with_discount: null,
        discount_until: "",
        main_image: "",
        tags: "",
        stock: 1,
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

    const handleSubmit = (e) => {
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
                        value={formData.title}
                        onChange={(v) => handleChange("title", v)}
                        placeholder="مثلاً آپارتمان نوساز"
                    />

                    {/* id */}
                    <Input
                        label="شناسه ملک (اختیاری)"
                        name="property_number"
                        value={formData.property_number || ""}
                        onChange={(v) => handleChange("property_number", v)}
                        placeholder="مثلاً A-1234"
                    />
                </div>

                {/* category and price */}
                <div className={"multi-inputs-style"}>
                    {/* category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                        <select
                            value={formData.category}
                            onChange={e => handleChange("category", e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 text-secondary-txt bg-primary-bg/40 px-4 py-2 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                        >
                            <option className={"text-secondary-txt bg-main-bg aria-selected:bg-violet-500"} value="sale">فروش</option>
                            <option className={"text-secondary-txt bg-main-bg aria-selected:bg-violet-500"} value="rent">اجاره</option>
                        </select>
                    </div>

                    {/* price */}
                    <Input
                        label="قیمت (تومان)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={(v) => handleChange("price", v)}
                        placeholder="مثلاً 1200000000"
                    />
                </div>

                {/* price with discount and discount date */}
                <div className={"multi-inputs-style"}>

                    {/* price with discount */}
                    <Input
                        label="قیمت با تخفیف (اختیاری)"
                        name="price_with_discount"
                        type="number"
                        value={formData.price_with_discount}
                        onChange={(v) => handleChange("price_with_discount", v)}
                        placeholder="مثلاً 1100000000"
                    />

                    {/* discount date */}
                    <Input
                        label="تاریخ پایان تخفیف (اختیاری)"
                        name="discount_until"
                        type="datetime-local"
                        value={formData.discount_until}
                        onChange={(v) => handleChange("discount_until", v)}
                    />
                </div>

                {/* province and city */}
                <div className={'multi-inputs-style'}>

                    {/* province */}
                    <Input
                        label="استان"
                        name="province"
                        value={formData.province}
                        onChange={(v) => handleChange("province", v)}
                        placeholder="مثلاً تهران"
                    />

                    {/* city */}
                    <Input
                        label="شهر"
                        name="city"
                        value={formData.city}
                        onChange={(v) => handleChange("city", v)}
                        placeholder="مثلاً تهران"
                    />
                </div>

                {/* images */}
                <div className={"multi-inputs-style"}>

                    {/* main_images */}
                    <Input
                        label="تصویر اصلی (URL)"
                        name="main_image"
                        inputProps={{dir: "ltr"}}
                        value={formData.main_image}
                        onChange={(v) => handleChange("main_image", v)}
                        placeholder="https://..."
                    />

                    {/* images */}
                    <Input
                        label="تصاویر بیشتر (URLها را با کاما (,) جدا کنید)"
                        inputProps={{dir: "ltr"}}
                        name="images"
                        value={formData.images || ""}
                        onChange={(v) => handleChange("images", v)}
                        placeholder="https://.../1.jpg, https://.../2.jpg"
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
                            className={"block text-sm font-medium"}
                        >
                            توضیحات
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
                        label="اطلاعات اضافی ملک (هر ویژگی را با '،' جدا کنید)"
                        name="metadata_notes"
                        value={formData.metadata?.notes?.join("، ") || ""}
                        onChange={(v) =>
                            handleChange("metadata", {
                                ...formData.metadata,
                                notes: v.split("،").map(s => s.trim()).filter(Boolean)
                            })
                        }
                        placeholder="مثلاً نورگیر عالی، سقف بلند، چشم‌انداز کوه"
                    />

                    {/* tags */}
                    <Input
                        label="برچسب‌ها (با کاما جدا کنید)"
                        name="tags"
                        value={formData.tags}
                        onChange={(v) => handleChange("tags", v)}
                        placeholder="مثلاً: نوساز، تهران"
                    />

                    {/* features and stock */}
                    <div className={"flex flex-col items-start gap-4 divide-y divide-secondary-txt @xl/main:divide-y-0 @xl/main:divide-x @xl/main:flex-row @xl/main:items-start @3xl/main:col-span-2"}>
                        {/* features */}
                        <div>
                            <p className="block text-sm font-medium mb-2">ویژگی‌ها</p>
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
                            <p className={"text-sm font-medium mb-2"}>موجودی</p>
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
            <button
                type="submit"
                disabled={isLoading}
                className={cn(
                    "w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-700 text-white py-2 rounded-lg transition font-medium cursor-pointer",
                    isLoading && "opacity-60 cursor-not-allowed"
                )}
            >
                {isLoading ? "در حال ارسال..." : "ثبت ملک"}
            </button>
        </form>
    );
}
