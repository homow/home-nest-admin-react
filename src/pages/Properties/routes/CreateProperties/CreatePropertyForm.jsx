import {useState} from "react";
import Input from "@/components/ui/Input";
import {cn} from "@/lib/utils/ui-utils.js";

export default function CreatePropertyForm({onSubmit, isLoading}) {
    /** @type {{title: string, category: string, price: string, description: string, province: string, city: string, features: string[], price_with_discount: string, discount_until: string, main_image: string, tags: string, stock: number}} */
    const [formData, setFormData] = useState({
        title: "",
        category: "sale",
        price: "",
        description: "",
        province: "",
        city: "",
        /** @type {string[]} */
        features: [],
        price_with_discount: "",
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
        "بالکون", "پارکینگ", "آسانسور", "انبار", "استخر"
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-main-bg p-6 rounded-2xl shadow-custom">

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

            <div className={"multi-inputs-style"}>
                <div>
                    <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                    <select
                        value={formData.category}
                        onChange={e => handleChange("category", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                    >
                        <option className={"bg-main-bg aria-selected:bg-violet-500"} value="sale">فروش</option>
                        <option className={"bg-main-bg aria-selected:bg-violet-500"} value="rent">اجاره</option>
                    </select>
                </div>

                <Input
                    label="قیمت (تومان)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={(v) => handleChange("price", v)}
                    placeholder="مثلاً 1200000000"
                />
            </div>

            {/* price */}
            <div className={"multi-inputs-style"}>
                <Input
                    label="قیمت با تخفیف (اختیاری)"
                    name="price_with_discount"
                    type="number"
                    value={formData.price_with_discount}
                    onChange={(v) => handleChange("price_with_discount", v)}
                    placeholder="مثلاً 1100000000"
                />

                <Input
                    label="تاریخ پایان تخفیف (اختیاری)"
                    name="discount_until"
                    type="datetime-local"
                    value={formData.discount_until}
                    onChange={(v) => handleChange("discount_until", v)}
                />
            </div>

            <div className={'multi-inputs-style'}>
                <Input
                    label="استان"
                    name="province"
                    value={formData.province}
                    onChange={(v) => handleChange("province", v)}
                    placeholder="مثلاً تهران"
                />

                <Input
                    label="شهر"
                    name="city"
                    value={formData.city}
                    onChange={(v) => handleChange("city", v)}
                    placeholder="مثلاً تهران"
                />
            </div>
            <div className={"multi-inputs-style"}>
                <Input
                    label="تصویر اصلی (URL)"
                    name="main_image"
                    inputProps={{dir: "ltr"}}
                    value={formData.main_image}
                    onChange={(v) => handleChange("main_image", v)}
                    placeholder="https://..."
                />

                <Input
                    label="تصاویر بیشتر (URLها را با کاما (,) جدا کنید)"
                    inputProps={{dir: "ltr"}}
                    name="images"
                    value={formData.images || ""}
                    onChange={(v) => handleChange("images", v)}
                    placeholder="https://.../1.jpg, https://.../2.jpg"
                />
            </div>

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
                    rows="10"
                    value={formData.description}
                    onChange={v => handleChange("description", v.target.value)}
                    placeholder="مثلاً طبقه دوم، ۲ خوابه، دارای استخر و چند حمام مجزا و . . ."
                    className={"mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"}
                >
                </textarea>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">ویژگی‌ها</label>
                <div className="flex flex-wrap gap-3">
                    {availableFeatures.map(feature => (
                        <label key={feature} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.features.includes(feature)}
                                onChange={() => handleFeatureToggle(feature)}
                                className="accent-violet-500"
                            />
                            <span>{feature}</span>
                        </label>
                    ))}
                </div>
            </div>

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

            <Input
                label="برچسب‌ها (با کاما جدا کنید)"
                name="tags"
                value={formData.tags}
                onChange={(v) => handleChange("tags", v)}
                placeholder="مثلاً: نوساز، تهران"
            />

            <div className="flex items-center gap-2">
                <input
                    id={"stock"}
                    type="checkbox"
                    checked={formData.stock === 1}
                    onChange={() => handleChange("stock", formData.stock === 1 ? 0 : 1)}
                    className="accent-violet-500"
                />
                <label htmlFor={"stock"} className="text-sm">در دسترس است</label>
            </div>

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
