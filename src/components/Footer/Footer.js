import React from "react";
import { FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { MdMailOutline } from "react-icons/md";

const Logout = () => {
  return (
    <footer className="flex justify-center py-10 bg-grey">
      <div className="bg-grey p-5 w-11/12 md:w-4/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <p className="text-justify">
              Circle is your go-to destination for seamless connections between
              job seekers and accommodation seekers in Sydney. We're committed
              to simplifying the search process and fostering meaningful
              connections. Our platform empowers users to find the perfect job
              and place to call home in the vibrant city of Sydney. Whether
              you're seeking career advancement or reliable tenants, Circle is
              here to support you every step of the way.
            </p>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <div className="flex justify-center items-center  m-2 md:justify-end">
              <span className="mr-1">CircleAustralia@gmail.com</span>
              <MdMailOutline fontSize="18px" />{" "}
            </div>
            <div className="flex justify-center m-2 md:justify-end">
              <FaPhoneAlt fontSize="16px" />
            </div>
            <div className="flex justify-center m-2 md:justify-end">
              <GrInstagram fontSize="16px" />
            </div>
            <div className="flex justify-center m-2 md:justify-end">
              <FaLinkedin fontSize="16px" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Logout;
