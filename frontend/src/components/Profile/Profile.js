import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router for navigation

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const CheckAccessTokenToProfilePage_API = `${URL_FORMAT}/User/Profile`;

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to the backend to check if the user is authenticated
        const response = await axios.get(CheckAccessTokenToProfilePage_API, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming you store the access token in localStorage
          },
        });
        // If authentication is succeessful, set loading to false
        setLoading(false);
      } catch (error) {
        // If authentication fails due to token expiration, attempt to refresh the token
        if (error.response && error.response.status === 403) {
          console.log("test1");
          try {
            console.log("test2");
            // Attempt to refresh the access token
            const refreshResponse = await axios.post(
              `${URL_FORMAT}/User/refreshToken`,
              {
                refreshToken: localStorage.getItem("refreshToken"),
              }
            );
            console.log("test3");
            // If token refresh is successful, update the access token in localStorage
            localStorage.setItem(
              "accessToken",
              refreshResponse.data.accessToken
            );
            // Retry the original request
            const retryResponse = await axios.get(
              CheckAccessTokenToProfilePage_API,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            // If the retry is successful, set loading to false
            setLoading(false);
          } catch (refreshError) {
            // If token refresh fails, redirect to the login page
            console.error("Token refresh failed:", refreshError);
            navigate("/login");
          }
        } else {
          // If authentication fails for other reasons, redirect to the login page
          console.error("Authentication failed:", error);
          navigate("/login");
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return <p>Authenticating...</p>;
  }

  // Render the profile page if authentication is successful
  return <p>Profile Page is under contruction.</p>;
};

export default Profile;
