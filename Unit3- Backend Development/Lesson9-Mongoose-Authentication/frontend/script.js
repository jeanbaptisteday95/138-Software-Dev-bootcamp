// Backend is running on a different localhost port than the frontend,
// so we must use the full backend origin here instead of a relative path.
const API_BASE = "http://localhost:3000/api/auth";
let isLoggedIn = false;

const messageEl = document.getElementById("message");
const profileOutput = document.getElementById("profileOutput");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const profileButton = document.getElementById("profileButton");
const logoutButton = document.getElementById("logoutButton");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const age = document.getElementById("registerAge").value;

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, age }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || data.message || "Failed to register");

    showMessage("Registration successful. Please log in.", "success");
    registerForm.reset();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Include cookies in the request so the server can send and later read the auth cookie.
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");

    isLoggedIn = true;
    showMessage(
      "Login successful. Access token stored in a secure httpOnly cookie.",
      "success",
    );
    loginForm.reset();
    updateUI();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

profileButton.addEventListener("click", fetchProfile);
logoutButton.addEventListener("click", logout);

function showMessage(text, type = "info") {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

async function fetchWithAuth(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Always send cookies with auth-protected requests so the server can verify the user.
  return await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
}

async function fetchProfile() {
  try {
    if (!isLoggedIn) {
      showMessage("Login first to fetch profile.", "error");
      return;
    }

    const response = await fetchWithAuth("/me", { method: "GET" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch profile");
    }

    profileOutput.textContent = JSON.stringify(data, null, 2);
    showMessage("Profile loaded successfully.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function logout() {
  try {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.warn("Logout request failed", error);
  }

  isLoggedIn = false;
  profileOutput.textContent = "";
  updateUI();
  showMessage("Logged out successfully.", "success");
}

function updateUI() {
  document.body.className = isLoggedIn ? "logged-in" : "logged-out";
}

async function checkLoginStatus() {
  try {
    const response = await fetch(`${API_BASE}/me`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      isLoggedIn = true;
      updateUI();
      showMessage("Already logged in via secure cookie.", "success");
    }
  } catch (error) {
    // not logged in yet
  }
}

checkLoginStatus();
