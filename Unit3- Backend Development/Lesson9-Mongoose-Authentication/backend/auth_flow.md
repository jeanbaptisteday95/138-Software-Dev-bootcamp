# JWT Authentication Flow

This diagram shows the full frontend-to-backend authentication flow.

```mermaid
flowchart TD
  A[Frontend Login Form]
  B[Backend Auth Controller]
  C[User Model Instance]
  D[Password Hash Compare]
  E[Sign access token]
  F[Store accessToken in httpOnly cookie]
  G[Protected API Request]
  H[Access token valid]
  I[Protected backend route]
  J[401 Unauthorized]

  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  F --> G
  G --> H
  H --> I
  G --> J
  J --> A
```

## Flow Explanation

- `accessToken`: a short-lived JWT (15 minutes) stored in a secure `httpOnly` cookie.
- `authMiddleware`: verifies the cookie token on every protected request.
- This example uses cookies instead of client-side storage.
- In production, prefer `httpOnly` secure cookies and CSRF-safe request handling for JWT auth.
