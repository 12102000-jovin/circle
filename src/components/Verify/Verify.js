import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Verify = () => {
  const { username, token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const VerifyToken_API = `${URL_FORMAT}/Authentication/Verify/`;
  const checkVerificationByUsername_API = `${URL_FORMAT}/Authentication/checkVerificationByUsername/`;

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
        <p>Verified</p>
      ) : (
        <p>Verification failed</p>
      )}
    </div>
  );
};

export default Verify;
