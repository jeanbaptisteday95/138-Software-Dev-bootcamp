const User = require("../models/User");
const { signAccessToken } = require("../middlewares/auth");
require('dotenv').config();

// Cookie options control how the browser stores and sends the auth cookie.
// The `accessToken` cookie is used to keep the user logged in without sending the JWT in the request body or headers manually.

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  // Prevent browser JavaScript from reading the cookie.
  // Example:
  // Without httpOnly, someone could do:
  // document.cookie
  httpOnly: true,
  
  // Controls whether the cookie is ONLY sent over HTTPS.
  //
  // If secure = true:
  // - Cookie is sent only on encrypted HTTPS connections
  // - Browser will NOT send it over normal HTTP
  //
  // Why important?
  // Prevents attackers on public Wi-Fi or networks from stealing cookies.
  //
  // In production:
  // Always use HTTPS, so secure should be true.
  //
  // During local development:
  // We usually use localhost with HTTP, so secure is often false.
  secure: isProduction,

   // Controls whether the browser sends the cookie
  // when requests come from OTHER websites.
  //
  // This mainly protects against CSRF attacks
  // (Cross-Site Request Forgery).
  //
  // Example CSRF attack:
  // You are logged into bank.com
  // Then you visit evil.com
  // evil.com secretly sends a request to bank.com
  // using your logged-in cookies.
  //
  // sameSite helps prevent that.
  sameSite: isProduction ? "none" : "lax",
  // "lax"
  // ------
  // Cookie is sent for:
  // - Normal navigation
  // - Clicking links
  // - Visiting the site directly
  //
  // But blocks many background cross-site requests.
  //
  // Good default for development and many apps.
  //
  // "none"
  // -------
  // Allows cookies to be sent from OTHER origins/domains.
  //
  // Needed when:
  // - Frontend and backend are on different domains
  // - Example:
  //   frontend.com -> API on api.frontend.com
  // - Or React frontend + separate backend server
  //
  // IMPORTANT:
  // sameSite: "none" REQUIRES secure: true
  // Modern browsers reject it otherwise.
  //
  // Common values:
  // - "strict" => very restrictive
  // - "lax"    => balanced/default
  // - "none"   => allow cross-site cookies
  // Keep the cookie alive for 15 minutes.
  maxAge: 15 * 60 * 1000,
};

const register = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists with this email." });
    }

    const user = new User({ name, email, age });
    // setting the virtual password field
    user.password = password;
    await user.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const accessToken = signAccessToken(user._id);
    // Store the JWT in a secure httpOnly cookie so the browser sends it automatically on later requests and JavaScript cannot read it directly.
    res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

    res.status(200).json({
      message: "Login successful.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the auth cookie in the browser so the user is no longer authenticated.
    res.clearCookie("accessToken", COOKIE_OPTIONS);
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, profile, logout };
