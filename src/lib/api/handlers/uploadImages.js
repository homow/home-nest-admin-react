import axiosInstance from '../axiosInstance.js';

const FUNCTION_URL = process.env.UPLOAD_IMAGE_FUNCTION;

if (!FUNCTION_URL) {
    console.warn('UPLOAD_IMAGE_FUNCTION is not set');
}

async function uploadSingle(file, opts = {}) {
    const {property_id, is_main} = opts;
    const form = new FormData();
    form.append('file', file);
    if (property_id) form.append('property_id', property_id);
    form.append('is_main', is_main ? 'true' : 'false');

    const res = await axiosInstance.post(FUNCTION_URL, form, {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: e => {
            console.log(e)
        },
    });

    return res.data;
}

async function uploadMultiple(files, opts = {}) {
    const arr = Array.from(files || []);
    const results = [];
    for (const f of arr) {
        results.push(await uploadSingle(f, {...opts, is_main: false}));
    }
    return results;
}

export {uploadMultiple, uploadSingle};
