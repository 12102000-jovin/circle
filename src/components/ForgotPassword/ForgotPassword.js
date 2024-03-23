import React, { useState } from "react";
import CircleLogo from "../../Images/CircleLogo.png";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const SendForgotPasswordEmail_API = `${URL_FORMAT}/User/SendResetPasswordEmail`;

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(SendForgotPasswordEmail_API, {
        email: email,
      });

      if (response.status === 200) {
        console.log("Success");
        setIsLoading(false);
        navigate("/ResetPasswordEmailSent", { state: email });
      }
    } catch (error) {
      console.error("Error sending email");

      if (error.response && error.response.data) {
        const { error: errorMessage } = error.response.data;
        setErrorMessage(errorMessage);
        setIsLoading(false);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        setIsLoading(false);
      }
    }
  };

  const handleCloseError = () => {
    setErrorMessage(false);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-11/12 md:w-2/3 lg:w-1/3 ">
        <div className="flex justify-center mb-4">
          <img src={CircleLogo} alt="Circle Logo" width="150" />
        </div>
        <div>
          <p className="mt-10 text-center text-3xl font-bold">
            Forgot Your Password?
          </p>
          <p className="mt-10 mb-10 text-lg">
            Enter your email and we will send you instructions to reset your
            password.
          </p>
          {errorMessage && (
            <div className="mb-5 flex justify-center ">
              <div
                class="w-full  bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative flex justify-between items-center w-full "
                role="alert"
              >
                <span class="block sm:inline text-sm">{errorMessage}</span>
                <span onClick={handleCloseError}>
                  <CloseIcon />
                </span>
              </div>
            </div>
          )}
          <label htmlFor="email" className="text-xl">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter Your Email"
            required
            className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          <div className="flex flex-col justify-center mt-5">
            <button
              className={`bg-signature hover:bg-secondary text-white font-bold py-2 px-4 rounded-full ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={handleForgotPassword}
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
                {isLoading ? <p>Sending Email...</p> : <p>Continue</p>}
              </div>
            </button>
            <a
              href="/login"
              className="text-center text-signature mt-5 underline"
            >
              Back to sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
