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
    const usernameInput = document.getElementById("name").value.trim();
    const passwordInputValue = passwordInput.value.trim();

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

  // Google login initialization
  window.onload = function () {
    google.accounts.id.initialize({
      client_id:
        "179042163928-r2mfbq4iik602htjv7tbk35m5lrc1m5m.apps.googleusercontent.com", // Your Google client ID
      callback: googleLoginHandler, // Callback function after login
    });

    google.accounts.id.prompt(); // Automatically triggers the Google login prompt
  };

  // Callback function to handle the Google login response
  function googleLoginHandler(response) {
    console.log(response); // Add this to check if the credential is being returned correctly

    if (response.credential) {
      const idToken = response.credential;

      // Send the ID token to your backend for verification
      fetch("https://noty-notepad.netlify.app/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: idToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Token verified successfully!") {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "main.html"; // Redirect to the main page
          } else {
            alert("Google login failed!");
          }
        })
        .catch((error) => {
          console.error("Error during token verification:", error);
          alert("Error verifying Google login.");
        });
    } else {
      alert("Google login failed!");
    }
  }
});
