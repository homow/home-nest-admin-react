import axiosInstance from "../axios-instance.js";

const createProperty = async data => {
    return await axiosInstance.post("/api/properties", data);
}

const getProperty = async () => {
    return await axiosInstance.get("/api/properties");
}

const uploadPropertyImages = async dataImg => {
    try {
        const {data} = await axiosInstance.post("/api/properties-image", dataImg, {
            headers: {"Content-Type": undefined}
        });
        return data;
    } catch (err) {
        console.log(err)
        const rawError = err.response?.data || err.message;
        console.error("Upload error:", rawError);
        return err;
    }
}

export {createProperty, uploadPropertyImages, getProperty}