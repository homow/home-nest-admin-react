# LOGIN

```
/api/login
```

### **`POST`**

*Send body as JSON:*

```json
{
  "email": "user@example.com",
  "password": "12345678",
  "remember": true
}
```

---

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
  "title": "Luxury Apartment",
  "category": "sale",
  "description": "3-bedroom apartment with pool",
  "province_and_city": "Tehran, Tehran",
  "address": "Niavaran St.",
  "features": ["parking", "balcony", "pool"],
  "price": 1200000000,
  "price_with_discount": 1100000000,
  "discount_until": "2025-12-01T00:00:00Z",
  "tags": ["modern", "north-tehran"],
  "metadata": {"floors": 2, "area": 150}
}
```
**Required:**
```
1.title
2.category(sale or rent)
3.description
4.province_and_city
5.address
6.features[1]
7.stock(1 or 0)
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
{ "id": "8e4d42f1-9b1c-4f2e-9a1b-abcdef123456" }
```

**Or via Query Parameters:**

```
DELETE /api/properties?num=PROP-1001
```

---