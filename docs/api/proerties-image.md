# 📸 `POST /api/properties-image`

Upload one or multiple property images to Supabase storage and link them to a property record.
This route handles **main image selection**, **duplicate image detection**, and **Supabase RPCs** for reserving/finalizing image records.

---

## 🧩 Endpoint Summary

|  Method  | Endpoint                |                Auth                 |       Body Type       |
|:--------:|:------------------------|:-----------------------------------:|:---------------------:|
| **POST** | `/api/properties-image` | ✅ Required (via Axios token header) | `multipart/form-data` |

---

## 🧠 Description

Uploads one or more images (`main_image` or `images`) and links them to a property record stored in the `properties` table.
Automatically handles:

* File validation (type, size)
* Duplicate prevention via `reserve_image_record` RPC
* Storage upload to Supabase bucket (`img`)
* Database linking in `property_images` table
* Updating property’s `images` and `main_image` fields

---

## ⚙️ Request Format

**Content-Type:** `multipart/form-data`

### Form Fields

| Field         | Type            | Required | Description                                                  |
|:--------------|:----------------|:--------:|:-------------------------------------------------------------|
| `property_id` | `string (UUID)` |    ✅     | The unique property ID from the `properties` table.          |
| `is_main`     | `boolean`       |    ❌     | If `true`, uploaded image is set as the main property image. |
| `main_image`  | `File`          |    ❌     | Single image file to set as the main image.                  |
| `images`      | `File[]`        |    ❌     | One or multiple additional image files.                      |

📦 **Allowed MIME types:**
`image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/gif`, `image/svg+xml`

🚫 **Max size:** `3 MB per file`

---

## 🧾 Example Request (Axios)

```js
import axios from "@/config/axios-instance";

const formData = new FormData();
formData.append("property_id", "89e3e06a-32e8-4a5a-b93f-8efefde431c7");
formData.append("is_main", "true");
formData.append("main_image", fileInput.files[0]); // File from <input type="file">

await axios.post("/api/properties-image", formData, {
    headers: {"Content-Type": "multipart/form-data"},
});
```

---

## ✅ Example Successful Response

```json
{
  "status": "ok",
  "results": [
    {
      "id": 211,
      "image_record_id": "bfa9e0a5-12e8-4dce-9d12-fba23902bb64",
      "path": "properties/a1c9c6b21fdc.jpeg",
      "url": "https://xyz.supabase.co/storage/v1/object/public/img/properties/a1c9c6b21fdc.jpeg",
      "is_main": true,
      "reused": false
    }
  ]
}
```

---

## ⚠️ Error Responses

| Status | Error Key                | Description                                                         |
|:------:|:-------------------------|:--------------------------------------------------------------------|
| `400`  | `invalid_property_id`    | `property_id` missing or invalid UUID.                              |
| `400`  | `no_files`               | No files included in form-data.                                     |
| `400`  | `file_type_not_allowed`  | Uploaded file has a disallowed MIME type.                           |
| `400`  | `file_size_invalid`      | File exceeds 3 MB or is empty.                                      |
| `403`  | `forbidden`              | RPC permission denied.                                              |
| `404`  | `property_not_found`     | Property with the provided ID does not exist.                       |
| `405`  | `method_not_allowed`     | Only POST requests are supported.                                   |
| `500`  | `internal_error`         | Unexpected server error, Supabase query failure, or upload failure. |
| `500`  | `upload_failed`          | Failed to upload file to Supabase storage.                          |
| `500`  | `upload_finalize_failed` | Failed to finalize image record after upload.                       |

---

## 🧮 Internal Flow Overview

1. **Parse form-data** using `formidable`.
2. **Validate** file type, size, and `property_id`.
3. **Check** property existence in Supabase (`properties` table).
4. **Call RPC:** `reserve_image_record(p_hash)` to check deduplication.
5. **Upload** file to Supabase storage if new.
6. **Call RPC:** `finalize_image_record_v2(p_id, p_path, p_url)` to finalize.
7. **Link** image in `property_images` table (set `is_main` if required).
8. **Update** property record with new image URLs.

---

## 🗃️ Supabase Dependencies

| RPC                                             | Description                                                                                           |
|:------------------------------------------------|:------------------------------------------------------------------------------------------------------|
| `reserve_image_record(p_hash)`                  | Reserves an image record and returns `{ out_id, out_path, out_url, created }`. Handles deduplication. |
| `finalize_image_record_v2(p_id, p_path, p_url)` | Finalizes the reserved image record with storage path and URL.                                        |

| Table             | Used For                                                                |
|:------------------|:------------------------------------------------------------------------|
| `properties`      | To verify existence and update `images` & `main_image` columns.         |
| `property_images` | To maintain many-to-many relation between properties and image records. |

| Bucket | Purpose                              |
|:-------|:-------------------------------------|
| `img`  | Stores all uploaded property images. |

---

## 🧰 Config Notes

| Setting           | Value                                                    |
|:------------------|:---------------------------------------------------------|
| `api.bodyParser`  | `false` (Required for Formidable file streams)           |
| `MAX_FILE_SIZE`   | `3 MB`                                                   |
| `Supabase client` | Created via `supabaseServer()` (server-side role access) |