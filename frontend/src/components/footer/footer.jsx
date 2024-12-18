import React, { useEffect, useRef } from "react";
import { IoMail } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { GiPlayButton } from "react-icons/gi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

const Footer = ({ page }) => {
  const footerRef = useRef(null);
  const imgRefs = useRef([]);

  useEffect(() => {

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 20%",
        end: "top 110%",
        scrub: 3,
        // markers:true
      },
    });

    imgRefs.current.forEach((img, i) => {
      timeline.fromTo(
        img,
        { opacity: 0, y: 50 },
        { opacity: 0.9, y: 0, duration: 1, delay: i * 0.5 }
      );
    });
  }, []);


  const sendMail = async () => {
    try {
      await axios.get("https://campus-mate.onrender.com/newsletter", {
        withCredentials: true,
      });
      alert("You just Subscribed to our newsletter");
    } catch (error) {
      console.log(error.response?.data?.msg);
      alert(error.response?.data?.msg);
    }
  };

  return (
    <div
      ref={footerRef}
      className="relative overflow-hidden h-[95vh] w-full bg-[#282524] flex flex-col items-center justify-center"
    >
      <div className="w-full h-[75%] relative flex items-center justify-center">
        <div className="w-[55%] h-full border-[2px] border-opacity-10 border-white flex flex-col items-center justify-center">
          <div className="w-full h-[40%] border-[2px] border-opacity-10 border-white border-l-0 border-r-0 border-b-0 border-t-0 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-semibold">
              <h1>Campus<span className="text-[#DFC9AC]">Mate</span></h1>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <img className="w-[10vw]" src="/footer-img.png" />
            </div>
          </div>
          <div className="z-10 w-full h-[60%] border-[2px] border-opacity-10 border-white border-l-0 border-r-0 border-b-0 flex items-start justify-center text-xl">
            <div className="w-full h-full text-white flex flex-col items-center justify-center gap-10">
              <div className="text-2xl">Quick Navigations</div>
              <div className="flex flex-col items-start justify-between gap-2">
                <h1>Home</h1>
                <h1>Gatepasses</h1>
                <h1>Complaints</h1>
              </div>
            </div>
            <div className="w-full h-full text-white flex flex-col items-center justify-center gap-10">
              <div className="text-2xl">Address</div>
              <div className="flex flex-col items-center justify-between gap-2 text-gray-300">
                <h1>Chitkara University</h1>
                <h1>Rajpura,140401</h1>
                <h1>Punjab</h1>
              </div>
            </div>
            <div className="w-full h-full text-white flex flex-col items-center justify-center gap-10 mt-2">
              <div className="text-2xl">Contact-Us</div>
              <div className="flex flex-col items-start justify-between gap-2 text-3xl">
                <IoMail />
                <FaLinkedin />
                <FaInstagramSquare />
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-[45%] h-full border-[2px] border-opacity-10 border-white border-l-0 p-[10%] flex items-start justify-start">
          <div className="w-full h-[70%] text-white flex flex-col items-start gap-10">
            <h1 className="text-2xl">CampusMate</h1>
            <h1 className="text-5xl">
              Subscribe <br></br> CampusMate
            </h1>
            <div className="relative flex items-center justify-start w-full">
              <input
                className="h-16 w-[60%] rounded-3xl p-5"
                type="email"
                placeholder="Email"
              />
              <button onClick={sendMail} className="absolute w-[15%] right-[35%] rounded-[100%] h-full bg-[#DFC9AC] flex items-center justify-center">
                <GiPlayButton />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="z-10 w-full h-[25%] flex items-end justify-start text-white">
        <div className="flex gap-5 mb-3 mx-3">
          <h1>Copyright @ 2024 CampusMate</h1>
          <h1>Terms of Policies</h1>
          <h1>Privacy Policy</h1>
          <h1>Terms Of Use</h1>
          <h1>Cookie Policy</h1>
        </div>
      </div>
      <img
        src="/footer-standing.svg"
        className="absolute -right-10 h-[70%] w-[20%] -bottom-[10%] opacity-50"
        ref={(el) => (imgRefs.current[0] = el)}
      />
      {/* <img
        src="/footer-sideGirl.svg"
        className="absolute h-[70%] w-[20%] -top-[8%] -right-[10%]"
        style={{ transform: "rotate(-45deg)" }}
        ref={(el) => (imgRefs.current[1] = el)}
      />  */}
      <img
        src="/footer-man.svg"
        className="opacity-10 absolute -left-[5%] h-[50%] w-[20%] -bottom-10 "
        ref={(el) => (imgRefs.current[2] = el)}
      />
      <img
        src="/footer-campus.svg"
        className="opacity-90 absolute right-[20%] h-[50%] w-[20%] -bottom-[10%]"
        ref={(el) => (imgRefs.current[3] = el)}
      />
    </div>
  );
};

export default Footer;
