import {useState} from "react";
import Input from "@/components/ui/Input";
import {cn} from "@/lib/utils/ui-utils.js";

export default function CreatePropertyForm({onSubmit, isLoading}) {
    const [formData, setFormData] = useState({
        title: "",
        category: "sale",
        price: "",
        description: "",
        province: "",
        city: "",
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

    const handleFeatureToggle = (feature) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
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
            <h2 className="text-xl font-bold mb-4">افزودن ملک جدید</h2>

            <Input
                label="عنوان ملک"
                name="title"
                value={formData.title}
                onChange={(v) => handleChange("title", v)}
                placeholder="مثلاً آپارتمان نوساز"
            />

            <div>
                <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                <select
                    value={formData.category}
                    onChange={e => handleChange("category", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                >
                    <option value="sale">فروش</option>
                    <option value="rent">اجاره</option>
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

            <Input
                label="قیمت با تخفیف (اختیاری)"
                name="price_with_discount"
                type="number"
                value={formData.price_with_discount}
                onChange={(v) => handleChange("price_with_discount", v)}
                placeholder="مثلاً 1100000000"
            />

            <Input
                label="تاریخ پایان تخفیف"
                name="discount_until"
                type="datetime-local"
                value={formData.discount_until}
                onChange={(v) => handleChange("discount_until", v)}
            />

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

            <Input
                label="تصویر اصلی (URL)"
                name="main_image"
                value={formData.main_image}
                onChange={(v) => handleChange("main_image", v)}
                placeholder="https://..."
            />

            <Input
                label="توضیحات"
                name="description"
                value={formData.description}
                onChange={(v) => handleChange("description", v)}
                placeholder="مثلاً طبقه دوم، ۲ خواب"
            />

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

            <Input
                label="برچسب‌ها (با کاما جدا کنید)"
                name="tags"
                value={formData.tags}
                onChange={(v) => handleChange("tags", v)}
                placeholder="مثلاً new, central"
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.stock === 1}
                    onChange={() => handleChange("stock", formData.stock === 1 ? 0 : 1)}
                    className="accent-violet-500"
                />
                <label className="text-sm">در دسترس است</label>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={cn(
                    "w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg transition font-medium",
                    isLoading && "opacity-60 cursor-not-allowed"
                )}
            >
                {isLoading ? "در حال ارسال..." : "ثبت ملک"}
            </button>
        </form>
    );
}
