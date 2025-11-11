# PROPERTIES

```
/api/properties
```

### **`GET`**

Fetch property information.
You can fetch a single property by `id`, `property_number`, or `property_seq`,
or fetch a list with pagination if no identifier is provided.

**Query Parameters:**

```
?id=<uuid>
?num=<property_number>
?seq=<property_seq>
?page=1&per=20
```

**Example:**

```
GET /api/properties?id=8e4d42f1-9b1c-4f2e-9a1b-abcdef123456
```

### **`POST`**

Create a new property *(Admin only)*.
Requires a Bearer token in the header.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**

```json
{
  "stock": 1,
  "category": "sale",
  "title": "Luxury Apartment",
  "address": "Niavaran St.",
  "province_and_city": "Tehran, Tehran",
  "price": 120,
  "price_with_discount": 100,
  "tags": [
    "modern",
    "north-tehran"
  ],
  "metadata": {
    "floors": 2,
    "area": 150
  },
  "discount_until": "2025-12-01T00:00:00Z",
  "features": [
    "parking",
    "balcony",
    "pool"
  ],
  "description": "3-bedroom apartment with pool"
}
```

**Required:**

```
1.title (string)
2.category ("sale" or "rent")
3.description (string)
4.province_and_city (string)
5.address (string)
6.features[] (min: 1 data in array)
7.stock (number: 1 or 0)
```

### **`PUT`**

Update an existing property *(Admin only)*.
You must specify the property using `id` or `property_number`.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body Example:**

```json
{
  "id": "8e4d42f1-9b1c-4f2e-9a1b-abcdef123456",
  "title": "Updated Apartment Title",
  "price": 950000000
}
```

### **`DELETE`**

Delete a property *(Admin only)*.
You must specify the property using `id` or `property_number`.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body Example:**

```json
{
  "id": "8e4d42f1-9b1c-4f2e-9a1b-abcdef123456"
}
```

**Or via Query Parameters:**

```
DELETE /api/properties?num=PROP-1001
```

---