---
marp: true
theme: default
paginate: true
---

![](../../resources/images/circuitstream_logo.png)

# Software Development Bootcamp

## Unit 3 · Backend Development

### Lesson 9: Mongoose - authentication

### Gurneesh Singh

---

# Agenda

- Recap: middleware chain
- Environment Variables
- Secure password hashing
- Issuing access tokens
- Auth middleware
- Protected resource requests

---

# Learning Objectives

By the end of this lesson you can…

1. Hash & verify passwords with **bcrypt**
2. Explain JWT structure and claim semantics
3. Issue short‑lived access tokens
4. Guard routes with custom `authMiddleware`
5. Implement client logic that attaches tokens to protected requests

---

# Recap • Middleware Chain

Client -> Express App -> logger -> json -> cookie -> routes

```javascript
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(routes);
```

Order matters – cross‑cutting concerns (logging, parsing) sit before routes.

---

# Environment Variables

```js
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lesson9_libraryDB";
```

- `process.env` is an object that contains the environment variables for the current process.
- Environment variables are used to store sensitive information that should not be committed to the repository.
- a `.env` file is created in the root of your project. This should be added to the `.gitignore` file so it is never uploaded to GitHub.

```env
MONGODB_URI=mongodb://127.0.0.1:27017/lesson9_libraryDB
ACCESS_SECRET=your_access_secret
```

---

# Tokens 101

<div style="font-size: 20px;">

## What is a Token?

A token is a small piece of data used to identify a user after login.

Think of it like a temporary access pass.

---

Example flow:

User logs in with email/password
Server verifies credentials
Server creates a token
Browser stores the token
Browser sends token with future requests
Server checks token to know who the user is

Instead of asking for username/password on every request, we use tokens.

---

## Why Do We Use Tokens?

Without tokens:

- User would need to log in again for every request
- Server would not know who is making requests

Tokens solve this by allowing "persistent authentication."

They help with:

- Keeping users logged in
- Identifying users
- Authorization
- Secure communication between frontend and backend

---

## What is JWT?

JWT stands for:

JSON Web Token

It is a standard format for creating authentication tokens.

A JWT is just a long encoded string.

Example:

```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...```

---

## What Information Does a JWT Store?

JWTs usually contain:

- User ID
- Email
- Role/permissions
- Expiry time

Example payload:

```
{
  "userId": "123",
  "email": "john@test.com",
  "role": "admin"
}
```
---

**JWT** = base64Url(**header**) ‑ **.** ‑ base64Url(**payload**) ‑ **.** ‑ **signature**

Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE3NDgxMjgwNzMsImV4cCI6MTc0ODEyODk3M30.tdXNJGTnN3XfSzckmQS_vuDLT3BEYGnsuah9fUbtU3Y`

---

```json
// header
{ "alg":"HS256","typ":"JWT" }
// payload
{ "sub":"507f1","iat":1698700000,"exp":1698700900 }
```

| Token      | Lifetime | Stored in                | Sent via | Purpose                         |
| ---------- | -------- | ------------------------ | -------- | ------------------------------- |
| **Access** | ≈15 min  | `httpOnly secure cookie` | `Cookie` | Prove identity on every request |


Cookie flags: **httpOnly + sameSite=Lax (+ secure in prod)** are important for cookie-based auth and proper security.


---

## Why JWTs Are Popular

JWTs are:

- Stateless
- Fast
- Easy to use across frontend/backend
- Good for APIs
- Widely supported

---

# Secure Password Hashing

```js
import bcrypt from "bcrypt";
const SALT = 10;
const hash = await bcrypt.hash(plain, SALT);
const ok = await bcrypt.compare(plain, hash);
```

*Hash* + *salt* in plain english: salt is randomness added to the password to make it more secure.
A hash is a one way function that combines the password and the salt to create a unique string.
This string is then stored in the database.
When the user logs in, the password is hashed and compared to the hash in the database.
If they match, the user is logged in.

---

# Mongoose Model Patterns

- `schema.statics.hashPassword()` is a model-level helper. It is invoked before a user is created.
- `schema.methods.isValidPassword()` is an instance method. It runs on a loaded `User` document.
- `schema.pre('save', ...)` is a hook. We use it to hash `passwordHash` automatically whenever the field changes.

---

# Issuing Tokens

```js
function signAccessToken(id) {
  return jwt.sign({ sub: id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}
```

`/login` flow:

1. Validate credentials → 401 on fail
2. `signAccessToken`
3. Set the JWT in an `httpOnly` secure cookie

---

# Auth Middleware Logic

```js
export function authMiddleware(req, res, next) {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken)
    return res.status(401).json({ error: "Missing access token" });

  try {
    req.userId = jwt.verify(accessToken, process.env.ACCESS_SECRET).sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
}
```

---

# Robust Error Handling

| Code | Scenario                      | Client action                      |
| ---- | ----------------------------- | ---------------------------------- |
| 401  | Missing/expired/invalid token | Obtain new token or redirect login |
| 403  | Authenticated but forbidden   | Show "Not authorized" UI           |
| 409  | Duplicate email on signup     | Show form error                    |
| 500  | Anything else                 | Generic error toast                |


---

# Summary

- **bcrypt** secures passwords
- **JWT**: readable yet tamper‑proof
- Short‑lived **access** token in an `httpOnly` cookie is safer for production
- Custom `authMiddleware` validates tokens on protected routes
- Client logic uses `credentials: include` to send cookies automatically
