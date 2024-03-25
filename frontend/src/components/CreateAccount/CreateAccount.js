import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircleLogo from "../../Images/CircleLogo.png";
import axios from "axios";
import CheckEmailVerification from "../CheckEmailVerification/CheckEmailVerification";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const CreateAccountModal = ({ open, onClose }) => {
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [showConfirmPasswordState, setShowConfirmPasswordState] =
    useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [verifyModalState, setVerifyModalState] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const CreateUser_API = `${URL_FORMAT}/User/CreateUserAccount`;

  const handleShowPassword = () => {
    setShowPasswordState(!showPasswordState);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPasswordState(!showConfirmPasswordState);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleCloseVerifyModal = () => {
    setVerifyModalState(false);
  };

  const handleCloseError = () => {
    setGeneralError(false);
  };

  const handleCreateAccount = async () => {
    // console.log(fullName);
    // console.log(email);
    // console.log(username);
    // console.log(password);
    // console.log(confirmPassword);

    // Reset previous error messages
    setGeneralError(false);
    setFullNameError("");
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Check if input fields are empty
    if (!fullName) {
      setFullNameError("Full Name is required.");
    }

    if (!email) {
      setEmailError("Email is required.");
    }

    if (!username) {
      setUsernameError("Username is required.");
    }

    if (!password) {
      setPasswordError("Password is required.");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required.");
    }
    // If any input field is empty, return without making the API call
    if (!fullName || !email || !username || !password || !confirmPassword) {
      return;
    }

    if (password.length < 8 && confirmPassword.length < 8) {
      setPasswordError("Password need at least 8 character");
      setConfirmPasswordError("Password need at least 8 character");
      return;
    } else if (password.length < 8) {
      setPasswordError("Password need at least 8 character");
      return;
    } else if (confirmPassword.length < 8) {
      setConfirmPasswordError("Password need at least 8 character");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Password does not match");
      setConfirmPasswordError("Password does not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(CreateUser_API, {
        fullName,
        email,
        username,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        setIsLoading(false);
        navigate("/CheckEmailVerification", { state: email });
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setIsLoading(false);
      if (error.response && error.response.data) {
        const { error: errorMessage } = error.response.data;
        setGeneralError(errorMessage); // Set general error message from backend
      } else {
        setGeneralError("An error occurred. Please try again later."); // Set a generic error message
      }
    }
  };

  useEffect(() => {
    if (open) {
      // Modal is opened, reset errors
      setGeneralError("");
      setFullNameError("");
      setEmailError("");
      setUsernameError("");
      setPasswordError("");
      setConfirmPasswordError("");
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullScreen>
        <DialogContent>
          <div className="flex justify-between mb-20">
            <div className="flex justify-center">
              <img src={CircleLogo} alt="circleLogo" width="100" />
            </div>
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 pl-2 pr-2 rounded"
              onClick={onClose}
            >
              <CloseIcon style={{ fontSize: "small" }} />
            </button>
          </div>

          <p className="text-2xl font-black text-signature text-center mb-5">
            Create Account
          </p>

          {generalError && (
            <div className="mb-5 flex justify-center ">
              <div
                class="w-full md:w-2/5 bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative flex justify-between items-center w-full "
                role="alert"
              >
                <span class="block sm:inline text-sm">{generalError}</span>
                <span onClick={handleCloseError}>
                  <CloseIcon />
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-10">
            <div className="flex flex-col w-full md:w-2/5 ">
              <label htmlFor="fullName" className="text-xl font-bold">
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={handleFullNameChange}
                autoComplete="fullName"
                placeholder="Full Name"
                required
                className="w-full rounded-md border py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {fullNameError && (
                <p className="text-red-500 text-sm">{fullNameError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-10">
            <div className="flex flex-col w-full md:w-2/5 ">
              <label htmlFor="email" className="text-xl font-bold">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                placeholder="Email"
                required
                className="w-full rounded-md border py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-10">
            <div className="flex flex-col w-full md:w-2/5 ">
              <label htmlFor="username" className="text-xl font-bold">
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                autoComplete="username"
                placeholder="Username"
                required
                className="w-full rounded-md border py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {usernameError && (
                <p className="text-red-500 text-sm">{usernameError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-10">
            <div className="flex flex-col w-full md:w-2/5 ">
              <label htmlFor="password" className="text-xl font-bold">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPasswordState ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="password"
                  placeholder="Password"
                  required
                  className="w-full rounded-md border py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="flex justify-end">
                  {showPasswordState ? (
                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature p-2 mr-2 rounded-md"
                      onClick={handleShowPassword}
                    >
                      <VisibilityOffIcon />
                    </button>
                  ) : (
                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature p-2 mr-2 rounded-md"
                      onClick={handleShowPassword}
                    >
                      <VisibilityIcon />
                    </button>
                  )}
                </div>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-10">
            <div className="flex flex-col w-full md:w-2/5 ">
              <label htmlFor="confirmPassword" className="text-xl font-bold">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPasswordState ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  autoComplete="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  className="w-full rounded-md border py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {showConfirmPasswordState ? (
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature p-2 mr-2 rounded-md"
                    onClick={handleShowConfirmPassword}
                  >
                    <VisibilityOffIcon />
                  </button>
                ) : (
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature p-2 mr-2 rounded-md"
                    onClick={handleShowConfirmPassword}
                  >
                    <VisibilityIcon />
                  </button>
                )}
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-sm">{confirmPasswordError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className={`bg-signature w-full md:w-2/5 mt-5 hover:bg-secondary text-white font-bold py-2 px-4 rounded ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={handleCreateAccount}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center">
                {isLoading && (
                  <CircularProgress
                    color="inherit"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                )}
                {isLoading ? "Creating Account..." : "Create Account"}
              </div>
            </button>
          </div>
          <div className="flex justify-center">
            <p className="mt-10">
              Already have a
              <span className="text-signature font-black"> Circle </span>
              account?{" "}
              <a className="underline text-signature" onClick={onClose}>
                Login
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
      {verifyModalState && (
        <div>
          <CheckEmailVerification
            open={verifyModalState}
            onClose={handleCloseVerifyModal}
            email={email}
          />
        </div>
      )}
    </div>
  );
};

export default CreateAccountModal;
