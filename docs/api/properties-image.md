# PROPERTY IMAGES

```
/api/property-images
```

### **`POST`**

Upload and link one or multiple images to a specific property.
This endpoint accepts **multipart/form-data** and can handle both a main image and additional gallery images.

> ✅ Only supports the **`POST`** method.
> ❌ Any other method will return `405 method_not_allowed`.

---

### **Headers**

```
Content-Type: multipart/form-data
```

*(No authorization header is required unless enforced by middleware elsewhere)*

---

### **Form Fields**

| Field         | Type                   | Required | Description                                                                                    |
|---------------|------------------------|----------|------------------------------------------------------------------------------------------------|
| `property_id` | `string (UUID)`        | ✅        | The unique ID of the property to attach images to.                                             |
| `is_main`     | `boolean (true/false)` | ❌        | If `true`, the uploaded image will be set as the property's main image.                        |
| `main_image`  | `file`                 | ❌        | Upload one main image. If this field is present, `is_main` is automatically treated as `true`. |
| `images`      | `file[]`               | ❌        | Upload one or multiple gallery images related to the property.                                 |

---

### **Allowed File Types**

```
image/jpeg
image/png
image/webp
image/avif
image/heic
image/heif
image/gif
image/svg+xml
```

### **File Size Limit**

```
3 MB per file
```

---

### **Example Request**

```
POST /api/property-images
```

**Form Data Example:**

| Field       | Type  | Example                                |
|-------------|-------|----------------------------------------|
| property_id | text  | `8e4d42f1-9b1c-4f2e-9a1b-abcdef123456` |
| is_main     | text  | `true`                                 |
| main_image  | file  | `apartment-front.jpg`                  |
| images      | files | `kitchen.png`, `pool.webp`             |

---

### **Success Response (200)**

```json
{
  "status": "ok",
  "results": [
    {
      "id": "c6d4b89e-6e90-4f7b-bf49-fbc7ef123abc",
      "image_record_id": "b01a3210-36f0-4f88-ae9d-bc13ad2bb654",
      "path": "properties/7e4f23b1d9a4c.png",
      "url": "https://xyz.supabase.co/storage/v1/object/public/img/properties/7e4f23b1d9a4c.png",
      "is_main": true,
      "reused": false
    },
    {
      "id": "d7f4ac2e-45e9-4f5b-8c67-83c9122fbcde",
      "image_record_id": "e98c7b0d-bcf3-40e2-8b81-7a34bc123f01",
      "path": "properties/12abf9e87f.png",
      "url": "https://xyz.supabase.co/storage/v1/object/public/img/properties/12abf9e87f.png",
      "is_main": false,
      "reused": false
    }
  ]
}
```

---

### **Error Responses**

| Status | Error Code              | Description                                                  |
|--------|-------------------------|--------------------------------------------------------------|
| `400`  | `invalid_form`          | The form data is malformed or missing.                       |
| `400`  | `invalid_property_id`   | The provided `property_id` is missing or not a valid UUID.   |
| `400`  | `no_files`              | No files were provided.                                      |
| `400`  | `file_type_not_allowed` | One or more files have an unsupported MIME type.             |
| `400`  | `file_size_invalid`     | File is empty or exceeds the 3MB limit.                      |
| `403`  | `forbidden`             | Permission denied (Supabase RPC returned restricted access). |
| `404`  | `property_not_found`    | The provided property does not exist.                        |
| `500`  | `internal_error`        | An unexpected server or Supabase error occurred.             |

---

### **Notes**

* The endpoint checks property existence **before and after** upload to prevent race conditions (e.g., if the property is deleted mid-upload).
* Duplicate images (detected via SHA-256 hash) are **reused** rather than re-uploaded — indicated by `"reused": true` in the response.
* If `is_main` or `main_image` is used, any previous main image will automatically be unset.
* Uploaded images are stored in Supabase Storage under the `img/properties/` path.
* Image links are stored in the `property_images` table and also update the `properties.images` and `properties.main_image` columns.
