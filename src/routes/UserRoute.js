const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const UserModel = require("../models/UserModel");

const router = express.Router();
const jwt = require("jsonwebtoken");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Circleaustralia@gmail.com",
    pass: "leja arpn eauo xssi",
  },
});

// Generate a random verification token
function generateVerificationToken() {
  const tokenLength = 20;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

const URL_FORMAT_FRONT_END = process.env.REACT_APP_URL_FORMAT_FRONT_END;

// Create User Account API
router.post("/CreateUserAccount", async (req, res) => {
  try {
    const { fullName, email, username, password, confirmPassword } = req.body;

    // Validate input data
    if (
      !fullName ||
      !email ||
      !username ||
      !password ||
      password !== confirmPassword // Check whether the password is the same as the confirm password
    ) {
      return res.status(400).json({ message: "Fill all the inpuit." });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const existingUserByUsername = await UserModel.findOne({ username });

    if (existingUserByEmail) {
      return res.status(409).json({ error: "Email already in use." });
    }

    if (existingUserByUsername) {
      return res.status(409).json({ error: "Username already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with a verification token
    const verificationToken = generateVerificationToken();
    const newUser = new UserModel({
      fullName,
      email,
      username,
      password: hashedPassword,
      verificationToken,
      isVerified: false, // Set initially to false
    });

    // Construct verification link
    const verificationLink = `${URL_FORMAT_FRONT_END}/Authentication/Verify/${username}/${verificationToken}`;

    // Save the user in the database
    await newUser.save();

    // Compose email
    const mailOptions = {
      from: "circleaustralia@gmail.com",
      to: email,
      subject: "Account Verification",
      html: `<div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
      <img src="https://i.ibb.co/6Zdpnmv/Circle-Logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h2 style="color: #333;">Account Verification</h2>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        Click <a href="${verificationLink}" style="color: #007bff; text-decoration: none; font-weight: bold;">here</a> 
        to verify your email address.
      </p>
      <p style="font-size: 14px; color: #777;">Thank you for choosing our service!</p>
    </div>`,
    };

    console.log("Sending verification email to:", mailOptions.to);

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);

    // Respond with a success message
    res.status(201).json({
      message: "User created successfully. Check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Resend verification email API
router.post("/ResendVerificationEmail", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input data
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide an email address." });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Generate a new verification token
    const newVerificationToken = generateVerificationToken();

    // Update user with the new verification token
    user.verificationToken = newVerificationToken;
    user.isVerified = false; // Set to false as the email is not verified yet
    await user.save();

    // Construct new verification link
    const verificationLink = `${URL_FORMAT_FRONT_END}/Authentication/Verify/${user.username}/${newVerificationToken}`;

    // Compose email
    const mailOptions = {
      from: "circleaustralia@gmail.com",
      to: email,
      subject: "Resend Account Verification",
      html: `<div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
      <img src="https://i.ibb.co/6Zdpnmv/Circle-Logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h2 style="color: #333;">Account Verification</h2>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        Click <a href="${verificationLink}" style="color: #007bff; text-decoration: none; font-weight: bold;">here</a> 
        to verify your email address.
      </p>
      <p style="font-size: 14px; color: #777;">Thank you for choosing our service!</p>
    </div>`,
    };

    console.log("Resending verification email to:", mailOptions.to);

    // Send the verification email
    const info = await transporter.sendMail(mailOptions);
    console.log("Resent verification email:", info.response);

    // Respond with a success message
    res.status(200).json({
      message:
        "Verification email resent successfully. Check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login API
router.post("/Login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Fill all the input." });
    }

    // Find the user by username or email
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // If the credentials are valid, generate a JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Send the token as part of the response
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
