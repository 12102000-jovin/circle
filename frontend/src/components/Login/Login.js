import React, { useState } from "react";
import CircleLogo from "../../Images/CircleLogo.png";
import LoginIllustration from "../../Images/Freelancer2.png";
import CreateAccount from "../CreateAccount/CreateAccount";
import EmailNotVerified from "../CheckEmailVerification/EmailNotVerified";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [createAccountModalState, setCreateAccountModalState] = useState(false);
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [notVerifiedModalState, setNotVerifiedModalState] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const UserLogin_API = `${URL_FORMAT}/User/Login`;

  const handleCreateAccountModal = () => {
    setCreateAccountModalState(true);
  };

  const handleCloseCreateAccountModal = () => {
    setCreateAccountModalState(false);
  };
  const handleShowPassword = () => {
    setShowPasswordState(!showPasswordState);
  };

  const handleCloseError = () => {
    setGeneralError(false);
  };

  const handleLogin = async () => {
    try {
      setGeneralError("");
      const response = await axios.post(UserLogin_API, {
        identifier: identifier,
        password: password,
      });

      if (response.status === 200) {
        const { data } = response;
        if (data.isVerified) {
          // User is verified, redirect to main application
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          navigate("/");
          console.log(data);
        } else {
          // User is not verified, show a message or take appropriate action
          setGeneralError(
            "Your account is not verified. Please verify your email."
          );
          setNotVerifiedModalState(true);
          setUserEmail(data.email);
        }
      }
    } catch (error) {
      console.error("User Login Error:", error);

      if (error.response && error.response.data) {
        const { error: errorMessage } = error.response.data;
        setGeneralError(errorMessage); // Set general error message from backend
      } else {
        setGeneralError("An error occurred. Please try again later."); // Set a generic error message
      }
    }
  };

  const handleCloseEmailNotVerifiedModal = () => {
    setNotVerifiedModalState(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="md:flex md:justify-around md:items-center md:w-3/4 lg:w-3/4">
          <div className="mb-2 md:mr-2 md:mb-0 max-w-xs md:max-w-prose">
            <div className="flex justify-center md:justify-start">
              <img
                className="mx-auto ml-8 md:mx-0 "
                src={CircleLogo}
                alt="Logo"
              />
            </div>

            <p className="mt-4 font-bold hidden lg:block">
              Welcome to Circle, a web application designed to bridge the gap
              between job seekers and individuals searching for accommodations
              in Sydney.
            </p>
            <div className="flex justify-center md:justify-start hidden lg:block">
              <img src={LoginIllustration} alt="Login Illustration" />
            </div>
          </div>

          <div className="mt-10 md:w-1/2 lg:w-1/4 mt-4 md:mt-0 min-w-[300px]">
            <div className="flex justify-center">
              <p className="mb-10 text-2xl font-bold text-signature">
                Login to your account
              </p>
            </div>

            {generalError && (
              <div className="mb-5 ">
                <div
                  class="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative flex justify-between items-center w-full "
                  role="alert"
                >
                  <span class="block sm:inline text-sm">{generalError}</span>
                  <span onClick={handleCloseError}>
                    <CloseIcon />
                  </span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-xl font-bold">
                Email/Username
              </label>
              <div className="mt-2">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="identifier"
                  placeholder="Email or Username"
                  required
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-10">
              <label htmlFor="password" className="block text-xl font-bold">
                Password
              </label>

              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPasswordState ? "text" : "password"}
                  autoComplete="password"
                  placeholder="Password"
                  required
                  className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setPassword(e.target.value)}
                />

                {showPasswordState ? (
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature mr-2 rounded-md"
                    onClick={handleShowPassword}
                  >
                    <VisibilityOffIcon />
                  </button>
                ) : (
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature mr-2 rounded-md"
                    onClick={handleShowPassword}
                  >
                    <VisibilityIcon />
                  </button>
                )}
              </div>
              <div className="flex justify-end">
                <a href="/forgotPassword" className="underline text-signature">
                  forgot password
                </a>
              </div>
              <div>
                <button
                  className="bg-signature w-full mt-5 hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
              <div className="flex justify-center">
                <p className="mt-10">
                  Don't have
                  <span className="text-signature font-black"> Circle </span>
                  account yet? {""}
                  <a
                    className="underline text-signature"
                    onClick={handleCreateAccountModal}
                  >
                    Create Account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Create Account Modal  */}
      <CreateAccount
        open={createAccountModalState}
        onClose={handleCloseCreateAccountModal}
      />
      <EmailNotVerified
        open={notVerifiedModalState}
        onClose={handleCloseEmailNotVerifiedModal}
        email={userEmail}
      />
    </div>
  );
};

export default Login;
