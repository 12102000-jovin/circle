import React, { useState, useRef } from "react";
import CircleLogo from "../../Images/CircleLogo.png";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";
import EmailVerified from "./EmailVerified";

const CheckEmailVerification = () => {
  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const ResendVerificationUser_API = `${URL_FORMAT}/User/ResendVerificationEmail`;
  const ValidateEmailVerificationOTP_API = `${URL_FORMAT}/User/ValidateEmailVerificationOTP`;

  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifiedModalState, setIsVerifiedModalState] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const location = useLocation();
  const email = location.state;

  const handleResendVerificationEmail = async () => {
    setIsResendLoading(true);

    console.log("email", email);

    try {
      const response = await axios.post(ResendVerificationUser_API, {
        email: email,
      });

      if (response.status === 200) {
        setIsResendLoading(false);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setIsResendLoading(false);
    }
  };

  // Digit Input
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpBoxReference = useRef([]);

  const [otpString, setOtpString] = useState(null);

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

  const handleOTP = async () => {
    try {
      setIsSubmitLoading(true);
      console.log(otpString);
      console.log(email);
      const response = await axios.post(ValidateEmailVerificationOTP_API, {
        email,
        otpInput: Number(otpString),
      });

      if (response.status === 200) {
        console.log("Email successfully Verified");
        setIsVerifiedModalState(true);
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

  const handleCloseVerifiedModal = () => {
    setIsVerifiedModalState(false);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-11/12 md:w-2/3 lg:w-2/5 ">
        <div className="flex flex-col justify-center items-center bg-white text-center rounded-xl">
          <img
            src={CircleLogo}
            alt="Circle Logo"
            width="150"
            className="mb-5 mt-4"
          />
          <p className="mt-1 mb-5 text-2xl text-center font-bold">
            Please Verify Your Email
          </p>
          <p>
            You are almost there! We have sent an email to{" "}
            <strong>{email}</strong>.
          </p>
          <p className="mt-5 mb-10">
            Please enter the verification code to verify your email.
          </p>
          {errorMessage && (
            <div className="flex justify-center w-full">
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

          <div className="w-full flex flex-col justify-center">
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

            <p className="mt-10"> Can't find the email?</p>
            <div className="flex flex-col justify-center">
              <button
                className={` text-signature font-bold  rounded-full ${
                  isSubmitLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={handleResendVerificationEmail}
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
                    <p className="underline">Resend Email</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <EmailVerified
        open={isVerifiedModalState}
        onClose={handleCloseVerifiedModal}
        email={email}
      />
    </div>
  );
};

export default CheckEmailVerification;
