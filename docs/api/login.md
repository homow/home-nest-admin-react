# 🔐 `POST /api/auth/login`

Authenticate a user with **Supabase Auth**, return the access token, and set a secure `refresh_token` cookie for session management.
Also updates the user’s profile metadata in the `user_profiles` table.

---

## 🧩 Endpoint Summary

|  Method  | Endpoint          |   Auth   |     Body Type      |
|:--------:|:------------------|:--------:|:------------------:|
| **POST** | `/api/auth/login` | ❌ Public | `application/json` |

---

## 🧠 Description

This endpoint performs a password-based sign-in using Supabase Auth (`signInWithPassword`), retrieves user profile data from the `user_profiles` table, updates login metadata, and stores a `refresh_token` cookie in the client’s browser.

---

## ⚙️ Request Format

**Content-Type:** `application/json`

### Body Fields

| Field      | Type      | Required | Description                                                                              |
|:-----------|:----------|:--------:|:-----------------------------------------------------------------------------------------|
| `email`    | `string`  |    ✅     | User’s registered email address.                                                         |
| `password` | `string`  |    ✅     | User’s Supabase Auth password.                                                           |
| `remember` | `boolean` |    ❌     | If true, sets a long-lived (30-day) refresh token cookie. Otherwise, expires in 8 hours. |

---

## 🧾 Example Request (Axios)

```js
import axios from "@/config/axios-instance";

const res = await axios.post("/api/auth/login", {
    email: "user@example.com",
    password: "secret123",
    remember: true,
});

console.log(res.data);
```

---

## ✅ Example Successful Response

```json
{
  "ok": true,
  "user": {
    "id": "2e2fcd0b-b4b2-46c9-8b61-b3ec09b4422a",
    "email": "user@example.com",
    "display_name": "John Doe",
    "role": "admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

A `Set-Cookie` header is also included:

```
Set-Cookie: sb_refresh_token=<token>; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000;
```

---

## ⚠️ Error Responses

| Status | Error Key              | Description                                      |
|:------:|:-----------------------|:-------------------------------------------------|
| `400`  | `MISSING_CREDENTIALS`  | Missing email or password.                       |
| `401`  | `INVALID_CREDENTIALS`  | Email or password incorrect.                     |
| `401`  | `INVALID_SESSION`      | Supabase session missing or incomplete.          |
| `403`  | —                      | Not used in this route.                          |
| `405`  | —                      | Request method is not POST.                      |
| `500`  | `PROFILE_FETCH_FAILED` | Failed to fetch user profile data from database. |
| `500`  | `INTERNAL_ERROR`       | Unexpected server error.                         |
| `503`  | `NETWORK_ERROR`        | Supabase connection issue or timeout.            |

---

## 🍪 Cookie Behavior

| Cookie Name        | Description                                     | Lifetime                                     | Flags                                                |
|:-------------------|:------------------------------------------------|:---------------------------------------------|:-----------------------------------------------------|
| `sb_refresh_token` | Supabase refresh token for session persistence. | `8h` (default) or `30d` (if `remember=true`) | `HttpOnly`, `SameSite=Lax`, `Secure` (in production) |

---

## 🗃️ Database Dependencies

| Source                  | Description                                                                                                                                                   |
|:------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Supabase Auth**       | Used for password-based authentication and session management.                                                                                                |
| **user_profiles table** | Queried for user data (`id`, `email`, `display_name`, `role`) and updated for: <br>• `last_strict_login_at` (ISO timestamp)<br>• `session_remember` (boolean) |

---

## 🔄 Internal Flow Overview

1. **Validate Input**
   Rejects request if `email` or `password` missing.
2. **Authenticate via Supabase Auth**
   Uses `signInWithPassword({ email, password })`.
3. **Handle Errors**
   Detects network vs credential issues separately.
4. **Fetch User Profile**
   From `user_profiles` table using admin Supabase client.
5. **Update Metadata**
   Updates `last_strict_login_at` and `session_remember`.
6. **Set Cookie**
   Saves the `refresh_token` as an HTTP-only cookie.
7. **Return JSON Response**
   Includes `user` object and `accessToken` for use in requests.

---

## 🧰 Config Notes

| Setting              | Value                                                                                 |
|:---------------------|:--------------------------------------------------------------------------------------|
| **Supabase Clients** | `supabaseAnon` (public, no session persistence) + `supabaseServer` (admin privileges) |
| **Cookie Library**   | [`cookie`](https://www.npmjs.com/package/cookie)                                      |
| **Security**         | Cookies marked `HttpOnly`, `SameSite=Lax`, `Secure` in production.                    |
