const jwt = require("jsonwebtoken");

// Access token: short-lived JWT stored in an httpOnly cookie.
// This is preferred because the browser sends the cookie automatically,
// and `httpOnly` prevents JavaScript from reading the token directly.
const signAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

const authMiddleware = (req, res, next) => {
  // The cookie parser middleware populates req.cookies.
  // We expect the browser to send back the accessToken cookie automatically.
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Missing access token" });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    req.userId = payload.sub;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};

module.exports = { authMiddleware, signAccessToken };
