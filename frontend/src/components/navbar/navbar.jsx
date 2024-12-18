import React from "react";
import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://campus-mate.onrender.com/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.clear();
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleQR = () => {
    navigate("/student/QR");
  };
  const handleMessMenu = () => {
    navigate("/student/mess");
  };
  return (
    <>
      <nav>
        <div className="nav__bar">
          <div className="logo">
            <a href="#">
              <img
                src="https://res.cloudinary.com/dhwaifalx/image/upload/v1732710122/logo-campusMate_m90scm.png"
                alt="logo"
              />
            </a>
          </div>
          <div className="nav__menu__btn" id="menu-btn">
            <i className="ri-menu-line"></i>
          </div>
        </div>
        <ul className="nav_links" id="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#gatepass">Gatepass</a>
          </li>
          <li>
            <a href="#complaint">Complaint</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a onClick={handleQR}>Your QR</a>
          </li>
          <li>
            <a onClick={handleMessMenu}>MessMenu</a>
          </li>
        </ul>
        <button className="btn nav__btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </>
  );
}

export default Navbar;
