import axiosInstance from "../axiosInstance.js";

export async function uploadPropertyImages({propertyId, main_image, images = []}) {
    const formData = new FormData();
    formData.append("property_id", propertyId);

    if (main_image) formData.append("main_image", main_image);
    images.forEach(img => formData.append("images", img));

    try {
        const {data} = await axiosInstance.post("/api/properties-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return data;
    } catch (err) {
        console.error("Upload error:", err.response?.data || err.message);
        return err;
    }
}
