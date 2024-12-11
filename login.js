"use strict";
document.addEventListener("DOMContentLoaded", () => {
  // Step 1: Store credentials in local storage
  const credentials = [{ username: "good", password: "bad" }];

  const preventLoginAccess = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const path = window.location.pathname;
    const isLoginPage = path === "/" || path.includes("index.html");

    if (isLoggedIn === "true" && isLoginPage) {
      // console.log("redirecting logged-in user from login page ...");
      window.location.href = "main.html";
    }
  };
  preventLoginAccess();
  // Step 2: Login button functionality
  document.querySelector(".btn-login").addEventListener("click", function () {
    // Get input values
    const usernameInput = document.getElementById("name").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    // Check if the entered credentials match any stored credentials
    const user = credentials.find(
      (cred) =>
        cred.username === usernameInput && cred.password === passwordInput
    );

    if (user) {
      // Store the logged-in user's data in local storage
      // localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      console.log("dasxbasj");

      // Redirect to the main page
      window.location.href = "main.html";
    } else {
      // Show an error message if credentials don't match
      alert("Invalid username or password. Please try again.");
    }
  });
});
