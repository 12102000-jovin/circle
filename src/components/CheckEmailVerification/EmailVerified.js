import React, { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Verified from "../../Images/Verified.svg";

import { useNavigate } from "react-router-dom/";

const CheckEmailVerification = ({ open, email }) => {
  const navigate = useNavigate();

  const handleCloseModal = () => {
    navigate("/");
  };

  return (
    <Dialog open={open} onClose={handleCloseModal}>
      <DialogContent>
        <div className="relative">
          <div className="absolute top-0 right-0">
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold
              py-1 pl-2 pr-2 rounded"
              onClick={handleCloseModal}
            >
              <CloseIcon style={{ fontSize: "small" }} />
            </button>
          </div>
          <div className=" flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl  ">
              <div className="flex flex-col justify-center items-center">
                <p className="text-3xl font-bold mb-6">Email Verified</p>
                <img
                  src={Verified}
                  alt="Verified Illustrations"
                  className="max-w-[300px] mb-10"
                />
                <p className="text-lg text-center">
                  Your email has been successfully verified.
                </p>
                <button
                  className="bg-signature hover:bg-secondary text-white font-bold py-2 px-4 rounded-full mt-6"
                  onClick={() => navigate("/login")}
                >
                  Login to Circle
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
