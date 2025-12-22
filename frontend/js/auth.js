
const API_BASE = "http://127.0.0.1:5000/api/auth";

const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const submitBtn = document.getElementById("auth-submit-btn");

const switchBtn = document.getElementById("auth-switch-btn");
const switchText = document.getElementById("auth-switch-text");
const title = document.getElementById("auth-title");

const messageBox = document.getElementById("auth-message");

let mode = "login"; 


function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `auth-message ${type}`;
  messageBox.classList.remove("hidden");
}

function clearMessage() {
  messageBox.className = "auth-message hidden";
  messageBox.textContent = "";
}

function setMode(newMode) {
  mode = newMode;
  clearMessage();

  if (mode === "login") {
    title.textContent = "Login";
    submitBtn.textContent = "Login";
    switchText.textContent = "Don’t have an account?";
    switchBtn.textContent = "Register instead";
  } else {
    title.textContent = "Register";
    submitBtn.textContent = "Register";
    switchText.textContent = "Already have an account?";
    switchBtn.textContent = "Login";
  }
}

async function submitAuth() {
  clearMessage();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showMessage("Please enter username and password");
    return;
  }

  const endpoint =
    mode === "login" ? "/login" : "/register";

  try {
    const res = await fetch(API_BASE + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.error || "Authentication failed");
      return;
    }

    // Success
    localStorage.setItem("username", username);
    showMessage("Success! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);

  } catch (err) {
    showMessage("Cannot connect to server");
  }
}

submitBtn.addEventListener("click", submitAuth);

switchBtn.addEventListener("click", () => {
  setMode(mode === "login" ? "register" : "login");
});

setMode("login");
