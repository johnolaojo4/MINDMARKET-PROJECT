const form = document.getElementById("userForm");
const submitBtn = form.querySelector('button[type="submit"]');
const termsCheckbox = document.getElementById("terms");

// Initially disabled
submitBtn.disabled = true;

// 🔑 Enable button only when form is valid + terms checked
function toggleSubmitButton() {
  if (form.checkValidity() && termsCheckbox.checked) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// Watch inputs and checkbox
form.querySelectorAll("input[required], select[required]").forEach((field) => {
  field.addEventListener("input", toggleSubmitButton);
});
termsCheckbox.addEventListener("change", toggleSubmitButton);

// Handle form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  submitBtn.textContent = "Creating Account...";
  submitBtn.disabled = true;

  const formData = new FormData(this);
  const userData = Object.fromEntries(formData.entries());

  // Password validation (extra guard)
  if (userData.password.length < 6) {
    showMessage("⚠️ Password must be at least 6 characters long.", "error");
    resetButton("Create Account");
    return;
  }

  try {
    const response = await fetch("https://mind-market-api.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      showMessage("🎉 Registration successful! Redirecting...", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => (window.location.href = "dashboard.html"), 2000);
    } else {
      showMessage("❌ " + (data.message || "Registration failed"), "error");
      resetButton("Create Account");
    }
  } catch (error) {
    showMessage("❌ Network error. Please try again.", "error");
    resetButton("Create Account");
  }
});

// ✅ Password toggle
document.querySelector(".toggle-password").addEventListener("click", () => {
  const pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
});

// ✅ Live validation styling
form.querySelectorAll("input[required], select[required]").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.checkValidity()) {
      field.classList.remove("invalid");
      field.classList.add("valid");
    } else {
      field.classList.remove("valid");
      field.classList.add("invalid");
    }
  });
});

// Helpers
function showMessage(message, type) {
  const box = document.getElementById("messageBox");
  box.textContent = message;
  box.className = `message ${type}`;
}

function resetButton(text) {
  submitBtn.textContent = text;
  toggleSubmitButton();
}