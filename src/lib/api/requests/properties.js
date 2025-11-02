import axiosInstance from "../axiosInstance.js";

const createProperty = async data => {
    return await axiosInstance.post("/api/properties", data);
}

const uploadPropertyImages = async dataImg => {
    try {
        const {data} = await axiosInstance.post("/api/properties-image", dataImg);
        return data;
    } catch (err) {
        console.error("Upload error:", err.response?.data || err.message);
        throw err;
    }
}

export {createProperty, uploadPropertyImages}