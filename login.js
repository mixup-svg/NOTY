"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Step 1: Store credentials in local storage
  const credentials = [{ username: "good", password: "bad" }];

  const preventLoginAccess = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const path = window.location.pathname;
    const isLoginPage = path === "/" || path.includes("index.html");

    if (isLoggedIn === "true" && isLoginPage) {
      // Redirect logged-in user from login page
      window.location.href = "main.html";
    }
  };
  preventLoginAccess();

  // Step 2: Toggle password visibility
  const eyeIcon = document.querySelector(".eye-icon");
  const passwordInput = document.getElementById("password");

  eyeIcon.addEventListener("click", function () {
    const isPasswordVisible = passwordInput.type === "text";

    // Toggle input type
    passwordInput.type = isPasswordVisible ? "password" : "text";

    // Toggle eye icon
    eyeIcon.name = isPasswordVisible ? "eye-outline" : "eye-off-outline";
  });

  // Step 3: Login button functionality
  const loginHandler = () => {
    // Get input values
    const usernameInput = document.getElementById("name").value.trim();
    const passwordInputValue = passwordInput.value.trim();

    // Check if the entered credentials match any stored credentials
    const user = credentials.find(
      (cred) =>
        cred.username === usernameInput && cred.password === passwordInputValue
    );

    if (user) {
      // Store the logged-in user's data in local storage
      localStorage.setItem("isLoggedIn", "true");

      // Redirect to the main page
      window.location.href = "main.html";
    } else {
      // Show an error message if credentials don't match
      alert("Invalid username or password. Please try again.");
    }
  };

  // Add event listener for the login button
  document.querySelector(".btn-login").addEventListener("click", loginHandler);

  // Step 4: Keydown event for Enter key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      loginHandler();
    }
  });
});
