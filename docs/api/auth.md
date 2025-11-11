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

*Response:*

```json
{
  "ok": true,
  "accessToken": "token",
  "user": {
    "id": "111-22-ee-aaa-333",
    "email": "example@mail.co",
    "display_name": "name",
    "role": "admin"
  }
}

```

---

# LOGOUT

```
/api/logout
```

### **`POST`**

*Send request with credentials (no body required):*

```
credentials: 'include'
```

*Response:*

```json
{
  "ok": true
}
```

---

# REFRESH

```
/api/refresh
```

### **`POST`**

*Send request with credentials (no body required):*

```
credentials: 'include'
```

*Response:*

```json
{
  "ok": true,
  "accessToken": "newAccessToken",
  "user": {
    "id": "111-22-ee-aaa-333",
    "email": "example@mail.co",
    "display_name": "name",
    "role": "admin"
  }
}
```
