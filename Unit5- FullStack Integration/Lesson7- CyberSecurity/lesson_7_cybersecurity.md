# Lesson 7: Cybersecurity

## Learning goals

By the end of this lesson, you should be able to:

- explain why cybersecurity matters, even for small apps
- recognize the most common backend vulnerabilities and why they happen
- apply the standard fix for each one in a Node/Express/MongoDB stack

## Why it matters

Web apps store passwords, personal data, and payment info. A single missed check can leak all of it. Security comes down to protecting three things (the **CIA triad**):

- **Confidentiality** — only the right people can read the data
- **Integrity** — data isn't tampered with
- **Availability** — the app stays up for real users

**Real breach:** in 2017, Equifax exposed the personal data (SSNs, birth dates, addresses) of 147 million people. The cause: a known vulnerability in Apache Struts (a web framework) that had a patch available for **two months** before the breach — nobody applied it. The fix would have been a routine dependency update. This is why "keep dependencies updated" isn't a minor chore — it's often the difference between safe and breached.

---

## 1. Injection attacks (SQL & NoSQL)

**Problem:** if user input is dropped straight into a database query, an attacker can change what the query actually does, not just what it searches for.

❌ **Bad:**
```javascript
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // The password is used INSIDE the database search itself — this is the bug
  const user = await User.findOne({ email: email, password: password });

  if (user) {
    res.send("Logged in");
  } else {
    res.send("Invalid login");
  }
});
```
An attacker doesn't send a normal password. Instead, they send this as the request body:
```json
{ "email": "victim@example.com", "password": { "$ne": null } }
```
MongoDB reads `{ "$ne": null }` as an instruction meaning "password is not null." Since every real user has a password that isn't null, this matches the first user it finds — the attacker is logged in without knowing any real password.

✅ **Better:**
```javascript
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Step 1: make sure both fields are plain text, not an object like { $ne: null }
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Step 2: search using ONLY the email — the password is never part of the search
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Step 3: compare the password separately, in JavaScript code — not in the database query
  const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

  if (passwordMatches) {
    res.send("Logged in");
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});
```

You can also add a safety net that automatically removes any `$`-prefixed keys from incoming requests, in case a route forgets this check:
```javascript
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());
```

**Real breach:** in 2015, UK telecom **TalkTalk** was hit by a SQL injection attack that stole the personal data of about 157,000 customers, including bank details for some. The attack exploited a webpage that hadn't been patched despite the vulnerability being known — and the database queries weren't using parameterized inputs, so attacker-supplied text was executed as part of the SQL itself. TalkTalk was fined £400,000 by the UK regulator. The fix is exactly the pattern above: never build a query by concatenating or directly embedding raw user input — validate types and let the query engine treat input strictly as data, never as code.

---

## 2. Command injection

**Problem:** if user input is passed straight into a shell command, an attacker can run their own commands on your server.

❌ **Bad:**
```javascript
const { exec } = require("child_process");

app.get("/ping", (req, res) => {
  const host = req.query.host;
  // "host" is inserted directly into a real terminal command
  exec(`ping ${host}`, (error, output) => {
    res.send(output);
  });
});
```
A normal request looks like `/ping?host=google.com`. But an attacker can send `/ping?host=google.com; rm -rf /` — everything after the semicolon runs as a **second, separate command** on your server.

✅ **Better:** avoid running shell commands built from user input entirely. If you truly need to, check the input against a strict pattern first (only letters, numbers, and dots — the shape of a real hostname) and reject anything else:
```javascript
app.get("/ping", (req, res) => {
  const host = req.query.host;

  // Only allow letters, numbers, and dots — reject everything else
  const looksLikeAHostname = /^[a-zA-Z0-9.]+$/.test(host);
  if (!looksLikeAHostname) {
    return res.status(400).json({ error: "Invalid host" });
  }

  exec(`ping ${host}`, (error, output) => {
    res.send(output);
  });
});
```

**Real breach:** the 2014 **"Shellshock"** bug was a flaw in the Bash shell that let attackers inject and run arbitrary commands through crafted environment variables — often via web server CGI scripts that passed request data into Bash. It affected an enormous number of servers worldwide because so many systems used Bash somewhere in their request-handling path. The lesson: any point where user input reaches a shell, directly or indirectly, is a command-injection risk — patching the vulnerable software and never trusting input passed to system-level commands are both required.

---

## 3. Cross-Site Scripting (XSS)

**Problem:** if user input (a comment, a bio) is stored and later rendered as raw HTML, an attacker's `<script>` tag runs in another user's browser — with that user's cookies and session.

❌ **Bad:**
```javascript
// "comment" comes from another user, straight from the database
function Comment({ comment }) {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
}
```
If someone submitted `<script>alert('hacked')</script>` as their comment, this code runs it as real code in every other visitor's browser — instead of showing it as plain text.

✅ **Better:**
```javascript
// Just render the comment as text — React escapes it automatically
function Comment({ comment }) {
  return <div>{comment}</div>;
}
```
On the backend, add a security library that sets safer default headers for every response:
```javascript
const helmet = require("helmet");
app.use(helmet());
```

**Real breach:** in 2005, a MySpace user named Samy embedded a script in his profile that silently added anyone who viewed it as a friend and copied the script onto their own profile. Because MySpace didn't sanitize profile HTML, the script self-replicated — reaching over **one million profiles in under 20 hours** and forcing MySpace to shut down temporarily. The fix is the same as above: never render user-submitted content as raw, executable HTML.

---

## 4. Cross-Site Request Forgery (CSRF)

**Problem:** browsers auto-attach cookies to requests — even ones triggered by a different, malicious website. If your app authenticates with a cookie, a malicious page can trigger an authenticated action on your app without the user clicking anything on your site.

❌ **Bad:**
```javascript
app.post("/login", async (req, res) => {
  // ... after checking the password is correct ...
  res.cookie("token", jwtToken); // sent with no protection settings
  res.send("Logged in");
});
```

✅ **Better:**
```javascript
app.post("/login", async (req, res) => {
  // ... after checking the password is correct ...
  res.cookie("token", jwtToken, {
    httpOnly: true,   // JavaScript running on the page can't read this cookie
    secure: true,     // only sent over HTTPS, never plain HTTP
    sameSite: "strict" // the browser won't send it along with requests from other websites
  });
  res.send("Logged in");
});
```
It's the `sameSite: "strict"` option specifically that stops CSRF — it tells the browser "don't attach this cookie unless the request came from my own site."

**Note:** many apps instead send the token back as plain data (not a cookie) and have the frontend attach it manually as a header: `Authorization: Bearer <token>`. In that setup, a malicious website has no way to read or attach your token, so this specific attack mostly doesn't apply.

**Real breach:** in 2008, security researchers demonstrated a CSRF flaw in **Netflix** where a malicious webpage could silently submit a request to a logged-in user's browser that changed their shipping address or added DVDs to their rental queue — the victim never had to click anything on Netflix itself, just visit the attacker's page while already logged in. This is what pushed CSRF tokens (or `sameSite` cookies, which didn't exist yet at the time) into becoming a standard defense across the web.

---

## 5. Input validation: whitelisting vs. blacklisting

**Problem:** trying to block "known bad" input (blacklisting) always misses something. Defining exactly what's allowed (whitelisting) is safer.

❌ **Bad:**
```javascript
// Blacklist: trying to guess and block every dangerous pattern
app.post("/signup", (req, res) => {
  const name = req.body.name;
  if (name.includes("<script>")) {
    return res.status(400).send("Invalid name");
  }
  // ... continues, but what about <img onerror=...> or dozens of other tricks?
});
```

✅ **Better:**
```javascript
// Whitelist: define exactly what a valid name looks like, and reject anything else
app.post("/signup", (req, res) => {
  const name = req.body.name;

  // ^ and $ mean "the whole string", a-zA-Z means letters only,
  // \s means spaces are allowed, {2,50} means length between 2 and 50
  const isValidName = /^[a-zA-Z\s]{2,50}$/.test(name);

  if (!isValidName) {
    return res.status(400).json({ error: "Invalid name" });
  }
  // ... continue signup
});
```

Also remember: **client-side validation is for UX, not security.** Attackers can bypass your frontend entirely with tools like Postman or curl — always validate again on the server.

---

## 6. Broken authentication

**Problem:** weak login systems let attackers guess their way in or steal credentials.

- **Brute force** — trying many passwords rapidly
- **Credential stuffing** — trying leaked username/password pairs from other breaches
- **Session hijacking** — stealing a session cookie/token to impersonate a user

❌ **Bad:**
```javascript
app.post("/signup", async (req, res) => {
  // Storing the raw password, exactly as the user typed it
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });
  await newUser.save();
  res.send("Account created");
});
```
If this database is ever leaked, every single password is readable in plain text.

✅ **Better:**
```javascript
const bcrypt = require("bcryptjs");

app.post("/signup", async (req, res) => {
  // Turn the password into a scrambled hash before saving it
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = new User({
    email: req.body.email,
    hashedPassword: hashedPassword
  });
  await newUser.save();
  res.send("Account created");
});
```
```javascript
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Compare the typed password against the saved hash — never the raw password
  const passwordMatches = await bcrypt.compare(req.body.password, user.hashedPassword);
  res.status(passwordMatches ? 200 : 401).send(passwordMatches ? "Logged in" : "Invalid login");
});
```
Also slow down repeated login attempts:
```javascript
const rateLimit = require("express-rate-limit");

// Allow at most 5 login attempts per 15 minutes from the same IP address
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.post("/login", loginLimiter, loginHandler);
```
For sensitive apps, add Multi-Factor Authentication (MFA) on top of passwords.

**Real breach:** in 2012, **LinkedIn** had 6.5 million password hashes leaked. The passwords were hashed with SHA-1 but **not salted** — meaning identical passwords produced identical hashes, and attackers could crack huge numbers of them at once using precomputed lookup tables. Most were cracked within days. A salted, slow hash like bcrypt (shown above) makes this kind of mass-cracking dramatically harder, since every hash is unique even for identical passwords.

---

## 7. Broken authorization (access control)

**Problem:** being *logged in* is not the same as being *allowed* to do something. It's easy to check the first and forget the second.

❌ **Bad:**
```javascript
// Being logged in is the ONLY check here
app.delete("/users/:id", authenticate, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});
```
Any logged-in user — not just admins — can delete any other user's account.

✅ **Better:**
```javascript
// A simple middleware that checks the user's role, in addition to being logged in
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

app.delete("/users/:id", authenticate, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});
```
This pattern is called **Role-Based Access Control (RBAC)**: `authenticate` checks "who is this person?" and `requireAdmin` separately checks "are they allowed to do this specific thing?" Every route that changes or deletes data needs both checks — not just the first one.

**Real breach:** in 2018, **Facebook**'s "View As" feature (which let users preview their profile as someone else would see it) had a bug that, combined with a separate video-uploader flaw, let attackers steal access tokens for **50 million accounts** — effectively logging in as those users. The root cause was that combining two features didn't properly re-check what the borrowed access token should actually be allowed to do. This is the same lesson as above at a larger scale: every code path that uses a token or session needs its own permission check, especially when features are composed together in ways the original developer didn't anticipate.

---

## 8. Leaky error messages

**Problem:** detailed error messages help attackers map out your system.

❌ **Bad:**
```javascript
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    // Sends the full technical error straight to the client
    res.status(500).send(err.stack);
  }
});
```
`err.stack` can reveal file paths, line numbers, and library versions — all useful clues for an attacker.

✅ **Better:**
```javascript
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err); // full detail goes to your server logs only
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
```

---

## 9. Exposed secrets

**Problem:** API keys, DB passwords, and JWT secrets hardcoded in source files get committed to git — permanently discoverable, even if deleted later.

❌ **Bad:**
```javascript
const JWT_SECRET = "mySecretKey123"; // hardcoded in source
```

✅ **Better:**
```env
# .env — add this file to .gitignore, never commit it
JWT_SECRET=use-a-long-random-string-here
MONGO_URI=mongodb://localhost:27017/myapp
```
```javascript
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
```

**Real breach:** in 2016, **Uber** engineers had hardcoded AWS credentials inside a private GitHub repository. Attackers found the credentials, used them to access a cloud storage bucket, and stole data belonging to **57 million riders and drivers**. Uber then paid the attackers $100,000 to delete the data and stay quiet — which, when it came out later, turned a breach into a much bigger scandal. The fix is simple in principle and easy to skip in practice: credentials never belong in source code or version control, even in a "private" repo.

---

## 10. Insecure dependencies

**Problem:** your app pulls in hundreds of npm packages — any one can carry a known, public vulnerability.

✅ **Better:**
```bash
npm audit       # lists known vulnerabilities in your dependencies
npm audit fix   # attempts to auto-upgrade to patched versions
```
Run this regularly, not just when something breaks.

---

## 11. Denial of Service (DoS/DDoS)

**Problem:** flooding your server or API with traffic (often from many machines — a "botnet") until it can't respond to real users.

**Mitigation:** rate limiting (shown above), a Web Application Firewall (WAF), and a CDN like Cloudflare to absorb traffic before it reaches your server. This is less about code and more about infrastructure, but it's still your responsibility to plan for it.

**Real breach:** in October 2016, a botnet built from infected IoT devices (mostly cameras and home routers with default, never-changed passwords) — known as **Mirai** — flooded the DNS provider **Dyn** with traffic. Because so many major sites (Twitter, Netflix, Reddit, GitHub, Spotify) relied on Dyn for DNS resolution, they all became unreachable for hours across the US. Notably, the root cause traced back to broken authentication too — thousands of devices were still using factory-default credentials, which is what let the botnet recruit them in the first place.

---

## 12. Use HTTPS in production

**Problem:** plain HTTP sends data — including passwords and tokens — as readable text over the network.

**Fix:** always serve production traffic over HTTPS, so data is encrypted in transit. Most hosting platforms (Render, Vercel, Heroku, etc.) provide this automatically — make sure it isn't disabled.

**Real breach:** in 2010, a researcher released a browser extension called **Firesheep** that let anyone on the same public Wi-Fi network (a coffee shop, for example) capture other users' session cookies for sites like Facebook and Twitter, because those sites only encrypted the login page but not the rest of the session. With Firesheep, hijacking someone else's logged-in session took one click. This single tool is largely credited with pushing major websites to adopt HTTPS across their *entire* site, not just login forms.

---

## 13. Building security into your workflow

Security isn't just code you write once — it's habits you keep:

- **Unit/integration tests** for things like password checks and access rules
- **Static analysis tools** (e.g. ESLint security plugins) to catch risky patterns automatically


---

## Quick recap

| Vulnerability | One-line fix |
|---|---|
| Injection (SQL/NoSQL) | Never let user input shape a query — validate types, compare secrets in code |
| Command injection | Never build shell commands from user input |
| XSS | Escape/sanitize output, set a Content-Security-Policy |
| CSRF | `sameSite: "strict"` on cookies, or use header-based tokens instead |
| Weak validation | Whitelist expected input; always validate on the server |
| Broken authentication | Hash passwords (bcrypt), rate-limit login, add MFA |
| Broken authorization | Check role/permissions on every sensitive route, not just login status |
| Leaky errors | Generic message to client, full detail in server logs |
| Exposed secrets | Environment variables + `.gitignore` |
| Insecure dependencies | `npm audit` regularly |
| DDoS | Rate limiting, WAF, CDN |
| Unencrypted traffic | HTTPS everywhere in production |
