const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");

router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Received token:", token);

    // Find the user in the database based on the verification token
    const user = await UserModel.findOne({ verificationToken: token });

    console.log("Found user:", user);

    if (!user) {
      // Token not found or user already verified
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the verification token

    // Save the updated user in the database
    await user.save();

    // You can also redirect the user to a page indicating successful verification
    res.status(200).json({ message: "Email address verified successfully." });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/checkVerificationByUsername/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user in the database based on the username
    const user = await UserModel.findOne({ username });

    if (!user) {
      // User not found
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with user's verification status
    res.status(200).json({ isVerified: user.isVerified });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
