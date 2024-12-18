import React, { useEffect, useState } from "react";
import "./adminOrUser.css";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

function AdminOrUser(props) {
  const navigate = useNavigate();

  useEffect(() => {
    // Initial animation for all elements with class "chooseUser"
    gsap.to(".chooseUser", {
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      duration: 0.2,
    });

    // Add mouseenter and mouseleave event listeners to elements with class "chooseUser"
    const users = document.getElementsByClassName("chooseUser");

    Array.from(users).forEach((user) => {
      user.addEventListener("mouseenter", () => {
        gsap.to(user, { scale: 1.2, duration: 0.1 });
      });

      user.addEventListener("mouseleave", () => {
        gsap.to(user, { scale: 1, duration: 0.1 });
      });
    });

    // Cleanup event listeners on component unmount
    return () => {
      Array.from(users).forEach((user) => {
        user.removeEventListener("mouseenter", () => { });
        user.removeEventListener("mouseleave", () => { });
      });
    };
  });


  const handleUserClick = () => navigate("/student-signup");
  const handleAdminClick = () => navigate("/warden-signup");
  const handleMessClick = () => navigate("/guard/mess-login");
  const handleGateClick = () => navigate("/guard/gate-login");

  return props.trigger ? (
    <div className="full">
      <div className="black_div"></div>
      <div className="popup_holder">
        {/* <button className="close-button">
          Close
        </button> */}
        <div className="popup flex items-center justify-center m-3 flex-1 flex-col position-fixed">
          <div
            onClick={handleGateClick}
            className="chooseUser opacity-0 scale-0 rounded-[20px] w-[500px] h-[10%] flex items-center justify-center relative cursor-pointer border-[5px] border-white hover:scale-110 transition-all"
          >
            <img
              className="absolute w-full h-full object-cover -z-10 rounded-[10px]"
              src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Gate Security"
            />
            <h1 className="text-white">GateSecurity</h1>
          </div>
          <div
            className="chooseUser opacity-0 scale-0 rounded-[20px] w-[500px] h-[10%] flex items-center justify-center relative cursor-pointer border-[5px] border-white hover:scale-110 transition-all"
            onClick={handleMessClick}
          >
            <img
              className="absolute w-full h-full object-cover -z-10 rounded-[10px]"
              src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Mess Security"
            />
            <h1 className="text-white">MessSecurity</h1>
          </div>
          <div
            onClick={handleAdminClick}
            className="chooseUser opacity-0 scale-0 rounded-[20px] w-[500px] h-[10%] flex items-center justify-center relative cursor-pointer border-[5px] border-white hover:scale-110 transition-all"
          >
            <img
              className="absolute w-full h-full object-cover -z-10 rounded-[10px]"
              src="https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Warden"
            />
            <h1 className="text-white">Warden</h1>
          </div>
          <div
            onClick={handleUserClick}
            className="chooseUser opacity-0 scale-0 rounded-[20px] w-[500px] h-[10%] flex items-center justify-center relative cursor-pointer border-[5px] border-white hover:scale-110 transition-all"
          >
            <img
              className="absolute w-full h-full object-cover -z-10 rounded-[10px]"
              src="https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Student"
            />
            <h1 className="text-white">Student</h1>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  ) : null;
}

export default AdminOrUser;