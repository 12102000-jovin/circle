import React, { useState, useRef } from "react";
import CircleLogo from "../../Images/CircleLogo.png";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpBoxReference = useRef([]);

  const [otpString, setOtpString] = useState(null);

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const ValidateResetPasswordOTP_API = `${URL_FORMAT}/User/ValidateResetPasswordOTP`;

  const handleChange = (value, index) => {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    // Concatenate the OTP digits into a single string
    const otpString = newArr.join("");
    setOtpString(otpString);

    if (value && index < 6 - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const handleBackspaceAndEnter = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < 6 - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const [isResendLoading, setIsResendLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const SendForgotPasswordEmail_API = `${URL_FORMAT}/User/SendResetPasswordEmail`;

  const handleResendResetPasswordEmail = async () => {
    try {
      setIsResendLoading(true);
      const response = await axios.post(SendForgotPasswordEmail_API, {
        email: email,
      });
      if (response.status === 200) {
        console.log("Email successfully sent");
        setIsResendLoading(false);
      }
    } catch (error) {
      console.error("Error sending email");
      setErrorMessage("An error occurred. Please try again later.");
      setIsResendLoading(false);
    }
  };

  const handleOTP = async () => {
    try {
      setIsSubmitLoading(true);
      console.log(otpString);
      console.log(email);
      const response = await axios.post(ValidateResetPasswordOTP_API, {
        email,
        otpInput: Number(otpString),
      });

      if (response.status === 200) {
        console.log("Email successfully sent");
        navigate("/ResetPasswordForm", { state: email });
        setIsSubmitLoading(false);
      }
    } catch (error) {
      console.error("Error sending email");
      setIsSubmitLoading(false);
      if (error.response && error.response.data) {
        const { error: errorMessage } = error.response.data;
        setErrorMessage(errorMessage); // Set general error message from backend
      } else {
        setErrorMessage("An error occurred. Please try again later."); // Set a generic error message
      }
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-11/12 md:w-2/3 lg:w-2/5 ">
        <div className="flex justify-center mb-4">
          <img src={CircleLogo} alt="Circle Logo" width="150" />
        </div>

        <p className="mt-10 text-center text-3xl font-bold">
          Enter 6-digit Code
        </p>
        <p className="mt-10 mb-10 text-lg text-center">
          Please check <strong>{email}</strong> for a verification code to reset
          your password.{" "}
        </p>

        {errorMessage && (
          <div className="flex justify-center">
            <div className="mb-10 w-5/6">
              <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded text-center">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2 md:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                ref={(reference) =>
                  (otpBoxReference.current[index] = reference)
                }
                className={`border h-10 md:h-12 p-3 w-1/3 md:w-14 lg:w-12 rounded-md block focus:border-2 focus:outline-none appearance-none text-center`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center mt-5">
          <button
            className={`bg-signature hover:bg-secondary text-white font-bold py-2 px-4 rounded-full ${
              isSubmitLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            onClick={handleOTP}
            disabled={isSubmitLoading}
          >
            <div className="flex items-center justify-center">
              {isSubmitLoading && (
                <CircularProgress
                  color="inherit"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                  }}
                />
              )}
              {isSubmitLoading ? <p>Submitting... </p> : <p>Submit</p>}
            </div>
          </button>
          <div className="flex flex-col justify-center mt-5">
            <button
              className={` text-signature font-bold  rounded-full ${
                isSubmitLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={handleResendResetPasswordEmail}
              disabled={isResendLoading}
            >
              <div className="flex items-center justify-center">
                {isResendLoading && (
                  <CircularProgress
                    color="inherit"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                )}
                {isResendLoading ? (
                  <p>Sending Email...</p>
                ) : (
                  <p>Resend Email</p>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSuccess;
