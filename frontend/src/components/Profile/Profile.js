import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router for navigation

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const URL_FORMAT = process.env.REACT_APP_URL_FORMAT;
  const CheckAccesTokenToProfilePage_API = `${URL_FORMAT}/User/Profile`;

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Make a request to the backend to check if the user is authenticated
        const response = await axios.get(CheckAccesTokenToProfilePage_API, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming you store the access token in localStorage
          },
        });
        // If authentication is succeessful, set loading to false
        setLoading(false);
      } catch (error) {
        // If authentication fails, redirect to the login page or display an error message
        console.error("Authentication failed:", error);
        // Redirect to the login page
        navigate("/login");

        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken);
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
