import React, { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Footer from "../footer/footer";
import AdminOrUser from "../adminOrUser/adminOrUser";
import "./LandingPage.css";
import "../adminOrUser/adminOrUser.css";
import "../popup.css";
import Hostel from "../hostelModel/Hostel";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  localStorage.removeItem("token"); // Remove from localStorage
  sessionStorage.removeItem("token"); // Remove from sessionStorage

  const [isOpen, setIsOpen] = useState(false);
  const [buttonPop, setButtonPop] = useState(false);
  const [apiData, setApiData] = useState(null); // State to store the API data

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/about");
  };

  const handleMenuButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  // Make an API call when the component mounts
  useEffect(() => {
    // Send request to clear cookie
    fetch("https://campus-mate.onrender.com/clearcookie", {
      method: "GET",
      credentials: "include", // Include cookies with the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setApiData(data);
        console.log("Data received:", data); // Verify the response from the server
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Your GSAP animations code
    window.addEventListener("load", () => {
      console.log("Hello");
      gsap.set("body", { backgroundColor: "white" });
      const tl = gsap.timeline();
      tl.to(".navbar-full", {
        opacity: 1,
        duration: 0.2,
      });
      tl.to(".nav-li", {
        opacity: 1,
        duration: 0.1,
        stagger: 0.1,
        ease: "expo.inOut",
      });
      tl.to(".header", {
        opacity: 1,
        duration: 0.1,
      });
      tl.to(".header-txt", {
        opacity: 1,
        duration: 0.1,
        stagger: 0.1,
      });
      tl.to(".about__image", {
        opacity: 1,
        duration: 0.1,
      });
      tl.to(".about__content", {
        opacity: 1,
        duration: 0.1,
      });
      tl.to(".about-txt", {
        opacity: 1,
        duration: 0.1,
        stagger: 0.1,
      });

      gsap.to(".room__container", {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ".room__container",
          // markers:true,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 3,
        },
      });
      gsap.to(".service", {
        opacity: 1,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ".service",
          // markers:true,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 3,
        },
      });
      gsap.to(".banner__container", {
        opacity: 1,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ".banner__container",
          // markers:true,
          start: "top 70%",
          end: "bottom 50%",
          scrub: 1,
        },
      });
      gsap.to("#page2 h1", {
        transform: "translateX(-65%)",
        // backgroundColor:"#383433",
        duration: 5,
        scrollTrigger: {
          trigger: "#page2",
          scroller: "body",
          scrub: 5,
          start: "top top",
          end: "bottom bottom",
          pin: true,
        },
      });
      gsap.to("body", {
        backgroundColor: "#383433",
        duration: 1,
        scrollTrigger: {
          trigger: "#page2",
          start: "top 20%",
          end: "bottom bottom",
          scrub: 3,
        },
      });
    });
  }, []);
  return (
    <div className="overflow-hidden">
      <nav className="navbar-full opacity-0 overflow-hidden">
        <div className="nav__bar">
          <div className="logo">
            <a href="#">
              <img
                src="https://res.cloudinary.com/dhwaifalx/image/upload/v1732710122/logo-campusMate_m90scm.png"
                alt="logo"
              />
            </a>
          </div>
          <div
            className="nav__menu__btn"
            id="menu-btn"
            onClick={handleMenuButtonClick}
          >
            <i className="ri-menu-line"></i>
          </div>
        </div>
        <ul className="nav__links" id="nav-links" onClick={handleNavLinkClick}>
          <li className="nav-li opacity-0">
            <a href="#home">Home</a>
          </li>
          <li className="nav-li opacity-0">
            <a href="#about">About</a>
          </li>
          <li className="nav-li opacity-0">
            <a href="#rooms">Rooms</a>
          </li>
          <li className="nav-li opacity-0">
            <a href="#service">Services</a>
          </li>
          <li className="nav-li opacity-0">
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="nav__btns">
          <button
            className="btn bg-[#383433]"
            onClick={() => setButtonPop(true)}
          >
            Login
          </button>
        </div>
      </nav>

      <header className="header opacity-0">
        <div className="black-div"></div>
        <div className="section__container header__container" id="home">
          <p className="header-txt opacity-0">Simple - Unique - Friendly</p>
          <h1 className="header-txt opacity-0">
            Make Yourself At Home
            <br />
            In Our{" "}
            <span className="header-txt opacity-0 text-[#383433]">Hostels</span>
            .
          </h1>
        </div>
      </header>

      <section className="section__container about__container" id="about">
        <div className="about__image opacity-0">
          <div className="w-[500px] h-[350px]">
            {/* <Canvas id="canvas-container" className="w-full h-full">
              <OrbitControls
                enableRotate={true}
                enablePan={true}
                enableZoom={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
                rotateSpeed={1}
              />
              <PerspectiveCamera makeDefault position={[0, 0, 20]} />
              <Hostel scale={0.75} position={[0, -5, 0]} />
              <ambientLight intensity={1} />
              <directionalLight intensity={1} position={[10, 10, 10]} />
            </Canvas> */}
            <img src="/about.jpg" alt="About Us" />
          </div>
        </div>
        <div className="about__content opacity-0">
          <p className="section__subheader about-txt opacity-0 ">ABOUT US</p>
          <h2 className="section__header about-txt opacity-0">
            The Second home away from your house!
          </h2>
          <p className="section__description about-txt opacity-0">
            With a focus on quality accommodations, personalized experiences,
            and seamless booking, our platform is dedicated to ensuring that
            every traveler embarks on their dream holiday with confidence and
            excitement.
          </p>
          <div className="about__btn about-txt opacity-0">
            <button
              className="btn bg-[#383433] about-txt opacity-0"
              onClick={handleClick}
            >
              Read More
            </button>
          </div>
        </div>
      </section>

      <div
        className="relative flex w-full h-screen items-end justify-start bg-transparent py-5"
        id="page2"
      >
        <h1 className="text-uppercase text-[40vw] text-white mx-20">
          CAMPUSMATE
        </h1>
      </div>

      <section
        className="section__container room__container opacity-0 text-white"
        id="rooms"
      >
        <p className="section__subheader text-white">ROOM OPTIONS AVAILABLE</p>
        <h2 className="section__header text-white">
          The Most Memorable Stay Time Starts Here.
        </h2>
        <div className="room__grid">{/* Room options */}</div>
      </section>

      <section className="service opacity-0 scale-0" id="service">
        <div className="section__container service__container">
          <div className="service__content">
            <p className="section__subheader">SERVICES</p>
            <h2 className="section__header">Strive Only For The Best.</h2>
            <ul className="service__list">
              <li>
                <span>
                  <i className="ri-shield-star-line"></i>
                </span>
                High class Security
              </li>
              <li>
                <span>
                  <i className="ri-24-hours-line"></i>
                </span>
                Well Maintained rooms
              </li>
              <li>
                <span>
                  <i className="ri-headphone-line"></i>
                </span>
                Mess Charges Included
              </li>
              <li>
                <span>
                  <i className="ri-map-2-line"></i>
                </span>
                Laundry Services included
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section__container banner__container opacity-0 scale-0">
        <div className="banner__content text-white">
          <div className="banner__card">
            <h4 className="text-white">800+</h4>
            <p>Rooms Available</p>
          </div>
          <div className="banner__card">
            <h4 className="text-white">2000+</h4>
            <p>Bookings Completed</p>
          </div>
          <div className="banner__card">
            <h4 className="text-white">
              4<NavLink to="/super-admin/login">.</NavLink>6 *
            </h4>
            <p>Ratings</p>
          </div>
        </div>
      </section>

      <Footer page="main" />

      <AdminOrUser trigger={buttonPop}>
        <button
          className="mt-5 bg-pink-600 px-8 py-3 text-white rounded-[10px] hover:text-pink-600 hover:bg-white transition-colors duration-100"
          onClick={() => setButtonPop(false)}
        >
          Close
        </button>
      </AdminOrUser>
    </div>
  );
}

export default LandingPage;
