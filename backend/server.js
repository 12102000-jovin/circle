// Load environment varaibles from a .env file
require("dotenv").config();

// Import necesssary libraries and modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Retrieve the MongoDB connection string from environment variables
const mongoString = process.env.DATABASE_URL;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoString);
const database = mongoose.connection;

// Event listener for MongoDB connection error
database.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Event listener for successful MongoDB connection
database.once("connected", () => {
  console.log("Database connected");
});

// Create an instance of the Express application
const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

// Enable CORS to allow cross-origin resource sharing
app.use(cors());

// Use cookie-parser middleware
app.use(cookieParser());

// Start the Express server on port 3003
const port = process.env.REACT_APP_SERVER_PORT;
app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});

const userRoute = require("./routes/UserRoute");
app.use("/User", userRoute);

module.exports = app;
