// Step 1: Store credentials in local storage
const credentials = [
  { username: "fish", password: "water" },
  { username: "sun", password: "moon" },
  { username: "good", password: "bad" },
];

// Save credentials in local storage (only if not already set)
if (!localStorage.getItem("credentials")) {
  localStorage.setItem("credentials", JSON.stringify(credentials));
}

// Step 2: Login button functionality
document.querySelector(".btn-login").addEventListener("click", function () {
  // Get input values
  const usernameInput = document.getElementById("name").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  // Retrieve stored credentials
  const storedCredentials = JSON.parse(localStorage.getItem("credentials"));

  // Check if the entered credentials match any stored credentials
  const isValidUser = storedCredentials.some(
    (cred) => cred.username === usernameInput && cred.password === passwordInput
  );

  if (isValidUser) {
    // Redirect to the notepad page if credentials match
    window.location.href = "main.html"; // Replace with the actual notepad page URL
  } else {
    // Show an error message if credentials don't match
    alert("Invalid username or password. Please try again.");
  }
});
