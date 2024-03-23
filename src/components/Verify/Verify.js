import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Verified from "../../Images/Verified.svg";

const Verify = () => {
  const { username, token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const VerifyToken_API = `${URL_FORMAT}/Authentication/Verify/`;
  const checkVerificationByUsername_API = `${URL_FORMAT}/Authentication/checkVerificationByUsername/`;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await fetch(`${VerifyToken_API}${token}`);

          if (response.status === 400) {
            // Assuming 404 indicates that the token does not exist anymore
            console.log("Token not found or expired");
            setVerified(true);
          } else {
            throw new Error(`Verification failed: ${response.statusText}`);
          }

          // Continue with verification logic...

          const data = await response.json();
          console.log(data); // Log the response for debugging

          // Check verification status using the username
          const checkVerification = await fetch(
            `${checkVerificationByUsername_API}${username}`
          );

          if (!checkVerification.ok) {
            throw new Error(
              `Username verification failed: ${checkVerification.statusText}`
            );
          }

          const checkVerificationData = await checkVerification.json();
          console.log(checkVerificationData); // Log the response for debugging

          // Set the verified state based on the username verification status
          setVerified(checkVerificationData.isVerified);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, username]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : verified ? (
        <div className="bg-gray-200 min-h-screen flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-md w-11/12 md:w-2/3 lg:w-2/5 ">
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
                onClick={() => navigate("/")}
              >
                Login to Circle
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 min-h-screen flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-md w-11/12 md:w-2/3 lg:w-2/5 ">
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
                onClick={() => navigate("/")}
              >
                Login to Circle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;
