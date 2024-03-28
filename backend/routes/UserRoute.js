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

    const salt = await bcrypt.genSalt();
    console.log(salt);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(password);

    // Generate OTP
    const otp = Math.floor(10000 + Math.random() * 900000); // 6-digit OTP
    // Set OTP expiration time
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    const newUser = new UserModel({
      fullName,
      email,
      username,
      password: hashedPassword,
      isVerified: false,
      otp: otp,
      otpExpires: otpExpiration,
    });

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
          Welcome to our platform! To complete your registration, please verify your email address by entering the one-time password (OTP) provided below:
      </p>
      <p style="font-size: 20px; color: #007bff; font-weight: bold;">
          Your OTP: <strong>${otp}</strong>
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Please enter this code in the appropriate field on our website to verify your email address and gain full access to our services.
      </p>
      <p style="font-size: 14px; color: #777;">Thank you for choosing our service!</p>
  </div>
  `,
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

    // Generate OTP
    const otp = Math.floor(10000 + Math.random() * 900000); // 6-digit OTP
    // Set OTP expiration time
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpiration;
    user.isVerified = false; // Set to false as the email is not verified yet
    await user.save();

    // Compose email
    const mailOptions = {
      from: "circleaustralia@gmail.com",
      to: email,
      subject: "Resend Account Verification",
      html: `<div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
      <img src="https://i.ibb.co/6Zdpnmv/Circle-Logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h2 style="color: #333;">Account Verification</h2>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Please verify your email address by entering the one-time password (OTP) provided below:
      </p>
      <p style="font-size: 20px; color: #007bff; font-weight: bold;">
          Your OTP: <strong>${otp}</strong>
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Please enter this code in the appropriate field on our website to verify your email address and gain full access to our services.
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

// Profile
router.get("/Profile", authenticateToken, (req, res) => {
  // If the execution reached here, it means the token is valid
  // You can access the user's information from req.user
  res.json({ message: "Access granted" });
});

// Send Reset Password Email
router.post("/SendResetPasswordEmail", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input data
    if (!email) {
      return res.status(400).json({ error: "Please provide an email address" });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Set OTP expiration time
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    console.log("currentTime", Date.now());
    console.log("expiredTime", otpExpiration);

    // Update user document with OTP and expiration time
    user.otp = otp;
    user.otpExpires = otpExpiration;
    await user.save();

    console.log(user);

    // Compose Email
    const mailOptions = {
      from: "circleaustralia@gmail.com",
      to: email,
      subject: "Reset your Circle Password",
      html: ` <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
      <img src="https://i.ibb.co/6Zdpnmv/Circle-Logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h2 style="color: #333;">Reset Password</h2>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        You've requested to reset your Circle account password. Please use the following OTP to reset your password:
        <strong>${otp}</strong>
      </p>
      <p style="font-size: 14px; color: #777; line-height: 1.6;">
        Note: This OTP is valid for 10 minutes. If you didn't request this, you can safely ignore this email.
      </p>
      <p style="font-size: 14px; color: #777;">Thank you for choosing our service!</p>
    </div>`,
    };
    console.log("Sending reset password email to:", mailOptions.to);

    // Send Reset Password Email
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset Password Email Sent:", info.response);

    // Respond witg a success message
    res.status(200).json({
      message:
        "Reset password email sent successfully. Please check your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check OTP for Reset Password
router.post("/ValidateResetPasswordOTP", async (req, res) => {
  try {
    const { email, otpInput } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userOtp = user.otp;
    const otpExpiration = user.otpExpires;

    if (userOtp !== otpInput) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > otpExpiration) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // OTP is correct and not expired
    res.json({ message: "OTP is valid" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check OTP for Verify User Email
router.post("/ValidateEmailVerificationOTP", async (req, res) => {
  try {
    const { email, otpInput } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userOtp = user.otp;
    const otpExpiration = user.otpExpires;

    if (userOtp !== otpInput) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > otpExpiration) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Assuming isVerified is a property in the user document
    user.isVerified = true;

    // Save the updated user document
    await user.save();

    // OTP is correct and not expired
    res.json({ message: "OTP is valid" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Reset Password
router.put("/ResetPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    console.log(email);
    console.log(newPassword);

    // Validate input data
    if (!newPassword) {
      return res
        .status(400)
        .json({ error: "Please provide your New Password" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password need at least 8 character" });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user wirh new password
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: hashedNewPassword,
        },
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user password:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

    // If the credentials are valid, generate access token and refresh token
    const accessToken = jwt.sign(
      { userEmail: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" } // Set expiration for access token
    );

    const refreshToken = jwt.sign(
      { userEmail: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1m" } // Set expiration for refresh token
    );

    // Store the refresh token in the database (hashed for security)
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    // Send the token as part of the response
    res.status(200).json({
      userId: user._id,
      isVerified: user.isVerified,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Refresh Token Endpoint
router.post("/refreshToken", async (req, res) => {
  const { refreshToken } = req.body;

  // Verify refresh token validity
  try {
    const user = await UserModel.findOne();

    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token." });
    }

    // Compare the hashed refresh token with the stored hashed token
    const refreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (!refreshTokenMatch) {
      return res.status(401).json({ error: "Invalid refresh token." });
    }

    // Verify if the refresh token has expired
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (decodedRefreshToken.exp < Date.now() / 1000) {
      return res.status(401).json({ error: "Refresh token has expired." });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userEmail: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    // Send the new access token to the client
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
