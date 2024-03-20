import React, { useState } from "react";
import CircleLogo from "../../Images/CircleLogo.png";
import { Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const CheckEmailVerification = ({ open, onClose, email }) => {
  const [isLoading, setIsLoading] = useState(false);

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const ResendVerificationUser_API = `${URL_FORMAT}/User/ResendVerificationEmail`;

  const handleResendVerificationEmail = async () => {
    setIsLoading(true);

    console.log(email);

    try {
      const response = await axios.post(ResendVerificationUser_API, {
        email: email,
      });

      if (response.status === 200) {
        setIsLoading(false);
        onClose();
      }
    } catch (error) {
      console.error("Error creating account:", error);
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
          <div className="flex flex-col justify-center items-center bg-white text-center rounded-xl">
            <img
              src={CircleLogo}
              alt="Circle Logo"
              width="100"
              className="mb-5 mt-4"
            />
            <p className="mt-1 mb-5 text-2xl text-center font-bold">
              Your email has not been verified!
            </p>
            <p>
              We have sent an email to <strong>{email} </strong> when you
              created your account.
            </p>
            <p className="mt-5">
              Just click on the link in that email to complete your account
              creation. If you don't see it, you may need to check your spam
              folder.
            </p>
            <p className="mt-5"> Still can't find the email?</p>

            <button
              className={`bg-signature text-white font-bold py-2 px-4 rounded mt-5 hover:bg-secondary ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={handleResendVerificationEmail}
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
                {isLoading ? "Sending Email..." : " Resend Email"}
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckEmailVerification;
