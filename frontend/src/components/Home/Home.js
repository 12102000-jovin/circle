import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";

import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

import HomeIllustration from "../../Images/Accomodation.svg";
import RoomHunt from "../../Images/SearchAccomodation.svg";
import JobHunt from "../../Images/JobHunt.svg";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in local storage
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Decode the token to get user information
      const decoded = jwtDecode(accessToken);

      console.log("This is the decoded: ", decoded);

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token expired, redirect to login page
        // navigate("/login"); liuggas
      } else {
        // Token is valid, user is logged in
        setIsLoggedIn(true);
      }
    } else {
      // Token doesn't exist, redirect to login page
      // navigate("/login");
    }
  }, [navigate]);

  // Function to handle logout
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Update isLoggedIn state to false
    setIsLoggedIn(false);
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="flex justify-center bg-grey pb-10">
        <div className="bg-grey p-5 w-11/12 md:w-4/5">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="max-w-[700px]">
              <p className="font-black text-3xl md:text-6xl text-signature mt-10 md:m-10 mb-5">
                Welcome to Circle!
              </p>
              <p className="md:m-10">
                <TypeAnimation
                  sequence={[
                    "Connecting Job Seekers",
                    1500,
                    "Connecting Room Seekers",
                    1500,
                    "Connecting Students",
                    1500,
                    "Connecting Property Owners",
                    1500,
                    "Connecting Freelancers",
                    1500,
                  ]}
                  wrapper="span"
                  speed={10}
                  className=" text-xl md:text-4xl font-black text-dark"
                  repeat={Infinity}
                />
              </p>
              <p className="md:m-10 mt-5 text-dark">
                Welcome to Circle, a web application designed to bridge the gap
                between job seekers and individuals searching for accommodations
                in Sydney.
              </p>
              <div>
                <Link
                  to="/login"
                  className="bg-signature hover:bg-secondary text-white font-bold py-2 px-4 rounded-full md:ml-10"
                >
                  Login
                </Link>
                <button className="py-2 px-4 rounded-full text-signature font-bold md:ml-1 mt-5">
                  About Us
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={HomeIllustration}
                alt="Connect"
                className="hidden md:block max-w-[600px] w-full m-10"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 bg-dark">
        <div className="flex justify-center items-center p-5">
          <div className="w-11/12 md:w-4/5">
            <p className="text-white text-4xl text-center font-black m-10">
              Find Job
            </p>
            <img
              src={JobHunt}
              alt="Find Job Illustrations"
              className="max-w-[350px] mx-auto"
            />
            <div className="grid place-items-center mt-10">
              <button className="bg-brighter hover:bg-signature text-white font-bold py-2 px-4 rounded-full">
                See More
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center p-5">
          <div className="w-11/12 md:w-4/5">
            <p className="text-white text-4xl text-center font-black m-10">
              Find Room
            </p>
            <img
              src={RoomHunt}
              alt="Find Job Illustrations"
              className="max-w-[350px] mx-auto"
            />
            <div className="grid place-items-center mt-10">
              <button className="bg-brighter hover:bg-signature text-white font-bold py-2 px-4 rounded-full">
                See More
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <hr />
      <div>
        <p className="font-thin text-end text-xs m-2">&copy; 2024 Circle</p>
      </div>
    </div>
  );
}

export default Home;
