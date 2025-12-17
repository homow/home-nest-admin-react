import {useEffect, useState} from "react";
import Button from "@components/button/Button.tsx";
import Input from "@ui/forms/Input";
import CheckBox from "@ui/forms/CheckBox";
import SelectBox from "@ui/forms/SelectBox";
import {RedStarField, ErrorMessageInputs} from "@ui/Fragments.tsx";
import {formatPriceDebounced, parsePriceFromString} from "@utils/helper.js";
import {cn} from "@utils/ui-utils.ts";

// initial value in form data
const initialFormData = {
    title: "",
    property_number: "",
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
}

export default function CreatePropertyForm({onSubmit, isLoading, successCreate, setSuccessCreate}) {
    const [formData, setFormData] = useState(initialFormData);
    const [hasError, setHasError] = useState(false);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        province_and_city: "",
        address: "",
        features: "",
        price: "",
        discount: ""
    });

    // test for has error now
    useEffect(() => {
        const rawErrors = Object.values(errors).filter(e => Boolean(e)).length > 0;
        setHasError(rawErrors);
    }, [errors])

    // reset form data after success create a property
    useEffect(() => {
        if (successCreate) setFormData(initialFormData);
        setSuccessCreate(false);
    }, [successCreate, setSuccessCreate]);

    // handle changes in data form
    const handleChange = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    // features available
    const availableFeatures = [
        "بالکن", "پارکینگ", "آسانسور", "انبار", "استخر"
    ];

    // handle features
    const handleFeatureToggle = feature => {
        // noinspection JSCheckFunctionSignatures
        setFormData(prevState => ({
            ...prevState,
            features: prevState.features.includes(feature)
                ? prevState.features.filter(f => f !== feature)
                : [...prevState.features, feature]
        }));
    };

    // check price
    const checkPrice = (price = formData.price, discount = formData.price_with_discount) => {
        const priceTrimmed = price.trim() ? parsePriceFromString(price) : 0;
        const priceWithDiscountTrimmed = discount.trim() ? parsePriceFromString(discount) : 0;

        if (!priceTrimmed && !priceWithDiscountTrimmed) return true;
        return priceWithDiscountTrimmed < priceTrimmed;
    }

    // check features error
    useEffect(() => {
        if (errors.features && formData.features.length > 0) {
            setErrors({...errors, features: ""})
        }
    }, [errors, formData.features.length]);

    // handle submit
    const handleSubmit = e => {
        e.preventDefault();
        const titleTrimmed = formData.title.trim();
        const descriptionTrimmed = formData.description.trim();
        const province_and_cityTrimmed = formData.province_and_city.trim();
        const addressTrimmed = formData.address.trim();
        const featuresTrimmed = formData.features.length > 0;

        const priceChecked = checkPrice();

        const newError = {
            title: titleTrimmed ? "" : "عنوان ملک اجباریه",
            description: descriptionTrimmed ? "" : "توضیحات ملک اجباریه",
            province_and_city: province_and_cityTrimmed ? "" : "استان و شهر اجباریه",
            address: addressTrimmed ? "" : "آدرس ملک اجباریه",
            features: featuresTrimmed ? "" : "حداقل یک ویژگی باید انتخاب شود",
            discount: priceChecked ? "" : "تخفیف باید از قیمت اصلی کمتر باشد",
            price: priceChecked ? "" : "قیمت اصلی باید از تخفیف بیشتر باشد"
        };

        if (!titleTrimmed || !descriptionTrimmed || !province_and_cityTrimmed || !addressTrimmed || !featuresTrimmed || !priceChecked) {
            setErrors(newError);
        } else {
            if (onSubmit) onSubmit(formData);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <p><span className={"text-amber-500 font-bold"}>توجه: </span>فیلدهایی که با <RedStarField/> مشخص شدن اجباری، و بقیه فیلدها اختیاری هستند.</p>
            <div className={"space-y-8 @6xl/main:grid grid-cols-2 gap-x-4"}>
                {/* title and id */}
                <div className={"multi-inputs-style"}>
                    {/* title */}
                    <Input
                        label="عنوان ملک"
                        name="title"
                        autoComplete="title"
                        value={formData.title}
                        onChange={event => {
                            const val = event.target.value;
                            handleChange("title", val)
                            if (errors.title && val.trim()) {
                                setErrors({...errors, title: ""});
                            }
                        }}
                        placeholder="مثلاً: ویلایی، صدرا"
                        req={true}
                        hasError={errors.title}
                    />

                    {/* id */}
                    <Input
                        autoComplete="property_number"
                        label="شناسه ملک"
                        name="property_number"
                        value={formData.property_number || ""}
                        onChange={event => handleChange("property_number", event.target.value)}
                        placeholder="مثلاً A-1234"
                    />
                </div>

                {/* category and price */}
                <div className={"multi-inputs-style"}>
                    {/* category */}
                    <SelectBox
                        label={"دسته بندی"}
                        value={formData.category}
                        onChange={e => handleChange("category", e)}
                        options={[
                            {value: "sale", label: "فروش"},
                            {value: "rent", label: "رهن"},
                            {value: "1", label: "1"},
                            {value: "2", label: "2"},
                            {value: "3", label: "3"},
                            {value: "4", label: "4"},
                            {value: "5", label: "5"},
                            {value: "6", label: "6"},
                            {value: "7", label: "7"},
                            {value: "8", label: "8"},
                            {value: "9", label: "9"},
                            {value: "10", label: "10"},
                        ]}
                    />

                    {/* price */}
                    <Input
                        dir={"ltr"}
                        label="قیمت به تومان (اگر وارد نکنید، توافقی میشه)"
                        name="price"
                        type="text"
                        autoComplete="price"
                        value={formData.price}
                        onChange={event => {
                            const val = event.target.value;
                            handleChange("price", val);
                            formatPriceDebounced(event, handleChange, "price");

                            const priceChecked = checkPrice(val);

                            if (errors.price && priceChecked) {
                                setErrors({...errors, price: "", discount: ""});
                            }
                        }}
                        placeholder="مثلاً 1,200,000,000"
                        hasError={errors.price}
                    />
                </div>

                {/* price with discount and discount date */}
                <div className={"multi-inputs-style"}>

                    {/* price with discount */}
                    <Input
                        dir={"ltr"}
                        autoComplete="price_with_discount"
                        label="قیمت با تخفیف"
                        name="price_with_discount"
                        type="text"
                        value={formData.price_with_discount}
                        onChange={event => {
                            const val = event.target.value;
                            handleChange("price_with_discount", val);

                            formatPriceDebounced(event, handleChange, "price_with_discount");
                            const priceChecked = checkPrice(formData.price, val);

                            if (errors.price && priceChecked) {
                                setErrors({...errors, price: "", discount: ""});
                            }
                        }}
                        placeholder="مثلاً 1,100,000,000"
                        hasError={errors.price}
                        errorMsg={errors.discount}
                    />

                    {/* discount date */}
                    <Input
                        label="تاریخ پایان تخفیف"
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
                        onChange={event => {
                            const val = event.target.value;
                            handleChange("province_and_city", val);
                            if (errors.province_and_city && val.trim()) {
                                setErrors({...errors, province_and_city: ""});
                            }
                        }}
                        placeholder="مثلاً فارس، شیراز"
                        req={true}
                        hasError={errors.province_and_city}
                    />

                    {/* address */}
                    <Input
                        label="آدرس"
                        name="address"
                        autoComplete="address"
                        value={formData.address}
                        onChange={event => {
                            const val = event.target.value;
                            handleChange("address", val);
                            if (errors.address && val.trim()) {
                                setErrors({...errors, address: ""});
                            }
                        }}
                        placeholder="مثلا: خیابان قصردشت، کوچه 53، پلاک 10"
                        req={true}
                        className={errors.address && "border-rose-600 bg-rose-600/10"}
                        hasError={errors.address}
                    />
                </div>
            </div>

            {/* tags, description, metaData, features */}
            <div className={"space-y-6 @5xl/main:space-y-0 @5xl/main:flex flex-row @5xl/main:*:w-full gap-4 items-start"}>

                {/* description */}
                <div>
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
                            onChange={event => {
                                const val = event.target.value;
                                handleChange("description", val);
                                if (errors.description && val.trim()) {
                                    setErrors({...errors, description: ""});
                                }
                            }}
                            placeholder="مثلاً طبقه دوم، ۲ خوابه، دارای استخر و چند حمام مجزا و . . ."
                            className={cn("select-box-scroll mt-1 block w-full rounded-lg border border-gray-300 bg-primary-bg/40 px-4 py-2 placeholder-secondary-txt focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition", errors.description && "border-rose-600 bg-rose-600/10")}
                        >
                        </textarea>
                    </div>
                    <ErrorMessageInputs msg={errors.description}/>
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
                        placeholder="مثلاً: نوساز، صدرا_شیراز"
                    />

                    {/* features and stock */}
                    <div className={"flex flex-col items-start gap-4 divide-y divide-secondary-txt @xl/main:divide-y-0 @xl/main:divide-x @xl/main:flex-row @xl/main:items-start @3xl/main:col-span-2"}>
                        {/* features */}
                        <div className={cn("pb-4 @xl/main:pl-4 @xl/main:pb-0", errors.features && "bg-rose-600/10")}>
                            <div>
                                <p className="flex flex-row gap-1 text-sm font-medium mb-2">
                                    ویژگی‌ها (حداقل یکی)
                                    <RedStarField/>
                                </p>
                                <div className="flex items-center flex-wrap gap-3">
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
                            <ErrorMessageInputs msg={errors.features}/>
                        </div>

                        {/* stock */}
                        <div>
                            <p className={"flex flex-row gap-1 text-sm font-medium mb-2"}>
                                موجودی
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
                hasError={hasError}
                disabled={isLoading || hasError}
                text={isLoading ? "در حال ارسال..." : "ثبت ملک"}
                type={"submit"}
            />
        </form>
    );
};
