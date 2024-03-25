import React, { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotVerified from "../../Images/NotVerified.svg";
import { useNavigate } from "react-router-dom/";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const CheckEmailVerification = ({ open, onClose, email }) => {
  const navigate = useNavigate();
  const [isResendLoading, setIsResendLoading] = useState(false);

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const ResendVerificationUser_API = `${URL_FORMAT}/User/ResendVerificationEmail`;

  const handleVerifyEmail = async () => {
    setIsResendLoading(true);

    console.log("email", email);

    try {
      const response = await axios.post(ResendVerificationUser_API, {
        email: email,
      });

      if (response.status === 200) {
        setIsResendLoading(false);
        navigate("/CheckEmailVerification", { state: email });
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setIsResendLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <div className="relative">
          <div className="absolute top-0 right-0">
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold
            py-1 pl-2 pr-2 rounded"
              onClick={onClose}
            >
              <CloseIcon style={{ fontSize: "small" }} />
            </button>
          </div>
          <div className="flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl">
              <div className="flex flex-col justify-center items-center">
                <p className="text-3xl font-bold mb-6">Email Not Verified</p>
                <img
                  src={NotVerified}
                  alt="Not Verified Illustrations"
                  className="max-w-[300px] mb-10"
                />
                <p className="text-lg text-center mb-5">
                  Your email {email} has not been verified yet. Please verify
                  your email to access all Circle features.
                </p>
                <button
                  className={`bg-signature hover:bg-secondary text-white font-bold py-2 px-4 rounded-full ${
                    isResendLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  onClick={handleVerifyEmail}
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
                      <p>Sending Verification Email...</p>
                    ) : (
                      <p>Verify Email</p>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckEmailVerification;
