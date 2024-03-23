import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import Done from "../../Images/Done.svg";
import { useNavigate } from "react-router-dom";

const PasswordChange = ({ open, onClose }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <p className="font-bold text-2xl text-center mx-10 mt-5">
          Your password has been changed
        </p>
        <div className="flex justify-center mt-10">
          <img
            src={Done}
            alt="password changed illustrations"
            className="max-w-[200px]"
          />
        </div>

        <div className="flex justify-center mt-10 mb-10">
          <button className="bg-signature hover:bg-secondary text-white font-bold py-2 px-4 rounded-full">
            Login to Circle
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChange;
