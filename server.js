const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = 8080;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Google OAuth2 Client ID (ensure this matches your Google Developer Console client ID)
const CLIENT_ID =
  "179042163928-d93koiu72q0i8q8psj6rkh0g5cb61qa8.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Route to verify Google ID token
app.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      message: "ID Token is required.",
    });
  }

  try {
    // Verify the ID token with the Google OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID, // Ensure this matches your client ID
    });

    // Extract user information from the payload
    const payload = ticket.getPayload();
    console.log("User verified:", payload); // Log user info for debugging

    // Respond with the user information or a success message
    res.status(200).json({
      message: "Token verified successfully!",
      user: payload, // Sending user information back to the frontend
    });
  } catch (error) {
    console.error("Error verifying token:", error); // Improved error logging
    res.status(400).json({
      message: "Invalid token.",
      error: error.message,
    });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
