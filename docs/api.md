Got it 😎
Here’s a clean, English documentation for your `/api/properties` route, reflecting the full functionality and the fact that your frontend handles the token automatically via `axios-instance`.

---

# **API Documentation: `/api/properties`**

Base URL: `/api/properties`

Authentication:

* **Admin operations** (`POST`, `PUT`, `DELETE`) require authentication.
* Token is automatically sent from the frontend using `axios-instance`.

---

## **1. GET** – Retrieve properties (Public)

Retrieve a single property or a list of properties.

**Query Parameters (optional):**

| Parameter | Type   | Description                            |
|-----------|--------|----------------------------------------|
| `id`      | string | UUID of the property                   |
| `num`     | string | Property number                        |
| `seq`     | number | Property sequence number               |
| `page`    | number | Page number for list (default: 1)      |
| `per`     | number | Items per page (default: 20, max: 100) |

**Response:**

* **200 OK**

```json
{
  "ok": true,
  "data": {
    /* single property object */
  }
}
```

or for lists:

```json
{
  "ok": true,
  "data": [
    /* array of property objects */
  ]
}
```

* **404 NOT_FOUND**

```json
{
  "error": "NOT_FOUND",
  "detail": "Error message"
}
```

* **500 INTERNAL_ERROR**

---

## **2. POST** – Create a new property (Admin only)

**Body Parameters (JSON):**

| Field                 | Type   | Required | Description                               |
|-----------------------|--------|----------|-------------------------------------------|
| `title`               | string | ✅        | Property title                            |
| `category`            | string | ✅        | `"rent"` or `"sale"`                      |
| `description`         | string | ✅        | Description of the property               |
| `province_and_city`   | string | ✅        | Location                                  |
| `address`             | string | ✅        | Street address                            |
| `features`            | array  | ✅        | Array of features (min 1 item)            |
| `price`               | number | ❌        | Price (optional, non-negative)            |
| `price_with_discount` | number | ❌        | Discounted price (optional, non-negative) |
| `discount_until`      | string | ❌        | ISO date string for discount expiration   |
| `main_image`          | string | ❌        | URL of main image                         |
| `images`              | array  | ❌        | Array of image URLs                       |
| `tags`                | array  | ❌        | Array of string tags                      |
| `metadata`            | object | ❌        | Optional extra metadata                   |
| `property_number`     | string | ❌        | Admin-defined short ID                    |

**Response:**

* **200 OK**

```json
{
  "ok": true,
  "property": {
    /* inserted property object */
  }
}
```

* **400 MISSING_FIELD / INVALID_CATEGORY / INVALID_FEATURES / INVALID_PRICE / INVALID_PRICE_WITH_DISCOUNT / INVALID_DISCOUNT_UNTIL**

* **403 FORBIDDEN** – Not an admin

* **500 DB_INSERT_FAILED / INTERNAL_ERROR**

---

## **3. PUT** – Update property (Admin only)

**Body Parameters (JSON):**

| Field                                           | Type   | Required | Description      |
|-------------------------------------------------|--------|----------|------------------|
| `id`                                            | string | ❌        | UUID of property |
| `property_number`                               | string | ❌        | Property number  |
| Other fields same as `POST` for updating values |        |          |                  |

> At least one identifier (`id` or `property_number`) is required.
> `property_seq` cannot be updated.

**Response:**

* **200 OK**

```json
{
  "ok": true,
  "property": {
    /* updated property object */
  }
}
```

* **400 MISSING_IDENTIFIER** – No `id` or `property_number` provided
* **403 FORBIDDEN** – Not an admin
* **404 UPDATE_FAILED** – DB update failed
* **500 INTERNAL_ERROR**

---

## **4. DELETE** – Delete property (Admin only)

**Query Parameters or Body (JSON):**

| Field             | Type   | Required | Description      |
|-------------------|--------|----------|------------------|
| `id`              | string | ❌        | UUID of property |
| `property_number` | string | ❌        | Property number  |

> At least one identifier is required.

**Response:**

* **200 OK**

```json
{
  "ok": true,
  "property": {
    /* deleted property object */
  }
}
```

* **400 MISSING_IDENTIFIER** – No `id` or `property_number` provided
* **403 FORBIDDEN** – Not an admin
* **404 DELETE_FAILED** – DB delete failed
* **500 INTERNAL_ERROR**

---

## **5. Error codes summary**

| Status | Code                        | Description                       |
|--------|-----------------------------|-----------------------------------|
| 400    | MISSING_FIELD               | Required field missing            |
| 400    | INVALID_CATEGORY            | Category not `"rent"` or `"sale"` |
| 400    | INVALID_FEATURES            | `features` array empty or invalid |
| 400    | INVALID_PRICE               | Price invalid                     |
| 400    | INVALID_PRICE_WITH_DISCOUNT | Discount price invalid            |
| 400    | INVALID_DISCOUNT_UNTIL      | Invalid date format               |
| 400    | MISSING_IDENTIFIER          | Missing `id` or `property_number` |
| 403    | FORBIDDEN                   | Admin access required             |
| 404    | NOT_FOUND                   | Property not found                |
| 404    | UPDATE_FAILED               | Update operation failed           |
| 404    | DELETE_FAILED               | Delete operation failed           |
| 500    | DB_INSERT_FAILED            | Failed to insert into DB          |
| 500    | INTERNAL_ERROR              | Internal server error             |
| 405    | METHOD_NOT_ALLOWED          | HTTP method not allowed           |
