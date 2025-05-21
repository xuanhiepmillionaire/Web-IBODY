const emailForm = document.getElementById("emailForm");
const tokenSection = document.getElementById("tokenSection");
const tokenForm = document.getElementById("tokenForm");
const passwordSection = document.getElementById("passwordSection");
const resetForm = document.getElementById("resetForm");
const API_BASE = "http://localhost:5221";

let currentToken = "";
let currentEmail = "";

const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");

if (tokenFromUrl) {
  currentToken = tokenFromUrl;
  emailForm.style.display = "none";
  tokenSection.style.display = "none";
  passwordSection.style.display = "block";
}

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  currentEmail = email;

  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const text = await res.text();
  alert(text);

  if (res.ok) {
    tokenSection.style.display = "block";
  }
});

tokenForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = document.getElementById("token").value.trim();
  if (token.length < 10) {
    alert("Token không hợp lệ");
    return;
  }

  currentToken = token;
  passwordSection.style.display = "block";
});

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword").value;

  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: currentToken, newPassword })
  });

  const text = await res.text();
  alert(text);

  if (res.ok) {
    window.location.href = "./index.html";
  }
});
