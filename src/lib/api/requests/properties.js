import axiosInstance from "../axios-instance.js";

const createProperty = async data => {
    return await axiosInstance.post("/properties", data);
}

const getProperty = async id => {
    if (id) return await axiosInstance.get(`/properties/${id}`);
    return await axiosInstance.get("/properties");
}

const uploadPropertyImages = async dataImg => {
    try {
        const {data} = await axiosInstance.post("/properties-image", dataImg, {
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

export {createProperty, uploadPropertyImages, getProperty};