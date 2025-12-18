import {
    buildObjectFromKeyValueArray,
    parsePriceFromString
} from "@utils/helper";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fixPropertyData = data => {
    return {
        tags: data.tags ? data.tags.split("،").map(item => item.trim()) : undefined,
        price_with_discount: data.price_with_discount?.trim() ? parsePriceFromString(data.price_with_discount) : undefined,
        price: data.price.trim() ? parsePriceFromString(data.price) : undefined,
        metadata: data.metadata.trim() ? buildObjectFromKeyValueArray(data.metadata.split("،")) : undefined,
        discount_until: data.discount_until.trim() ? new Date(data.discount_until).toISOString() : undefined,
        title: data.title.trim(),
        description: data.description.trim(),
        province_and_city: data.province_and_city.trim(),
        address: data.address.trim(),
        property_number: data.property_number.trim() ? data.property_number.trim() : undefined,
    }
}

export {delay, fixPropertyData};