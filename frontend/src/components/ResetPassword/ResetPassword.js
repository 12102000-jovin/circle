import React, { useState } from "react";
import CircleLogo from "../../Images/CircleLogo.png";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordChanged from "./PasswordChanged";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordChangedModalState, setPasswordChangedModalState] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const ResetPassword_API = `${URL_FORMAT}/User/ResetPassword`;

  const handleShowPassword = () => {
    setShowPasswordState(!showPasswordState);
  };

  const handleResetPassword = async () => {
    console.log(newPassword);
    try {
      setIsLoading(true);
      const response = await axios.put(ResetPassword_API, {
        email: email,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        setIsLoading(false);
        setPasswordChangedModalState(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { error: errorMessage } = error.response.data;
        setErrorMessage(errorMessage);
        setIsLoading(false);
      } else {
        setErrorMessage("An error occurred. Please try again later."); // Set a generic error message
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-11/12 md:w-2/3 lg:w-1/3 ">
        <div className="flex justify-center mb-4">
          <img src={CircleLogo} alt="Circle Logo" width="150" />
        </div>
        <div>
          <p className="mt-10 mb-10 text-start text-3xl font-bold">
            Reset Password
          </p>
          <label htmlFor="newPassword" className="text-xl ">
            New Password
          </label>

          <div className="mt-2 relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswordState ? "text" : "password"}
              placeholder="Enter Your New Password"
              required
              className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {showPasswordState ? (
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature mr-2 rounded-md"
                onClick={handleShowPassword}
              >
                <VisibilityOffIcon className="p-0" />
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
          <div className="flex flex-col justify-center mt-5">
            <button
              className={`bg-signature hover:bg-secondary text-white font-bold py-2 px-4 rounded-full ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={handleResetPassword}
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
                {isLoading ? <p>Reseting Password...</p> : <p>Continue</p>}
              </div>
            </button>
          </div>
        </div>
      </div>
      <PasswordChanged open={passwordChangedModalState} />
    </div>
  );
};

export default ResetPassword;
