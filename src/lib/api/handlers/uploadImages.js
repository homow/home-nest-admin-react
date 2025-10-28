import axiosInstance from '../axiosInstance.js';

async function uploadImages(files, {property_id, is_main} = {}) {
    const form = new FormData();

    if (is_main && files[0]) {
        form.append('main_image', files[0]);
    } else {
        for (const f of files) form.append('images', f);
    }
    if (property_id) form.append('property_id', property_id);

    const res = await axiosInstance.post('/api/upload-images', form, {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: (e) => {
            // درصد آپلود
            if (e.total) {
                console.log('progress', Math.round((e.loaded * 100) / e.total));
            }
        },
    });
    return res.data;
}