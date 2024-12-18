import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import "../studentLandingPage/studentLandingPage.css";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import Bookings from "../booking/booking";
import "../repeatPop.css";
import Gatepass from "../gatepass/gatepass";
import Complaint from "../complaint/complaint";
import { BsFillPencilFill } from "react-icons/bs";
import axios from "axios";
import MarqueeComponent from "../Marquee/MarqueeComponent";
import Hero from "./hero";

function StudentLandingPage() {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const toRotate = ["beginning", "friends", "family"];
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);

  const [isRoomBooked, setIsRoomBooked] = useState(false);

  const period = 100;

  const navigate = useNavigate();

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }
    if (!isDeleting && updatedText == fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText == "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  };

  function handlePopBook() {
    const forms = document.getElementsByClassName("popBook");
    for (let i = 0; i < forms.length; i++) {
      forms[i].style.transform = "scale(1)";
    }
  }
  function handlePopGate() {
    const forms = document.getElementsByClassName("popGate");
    for (let i = 0; i < forms.length; i++) {
      forms[i].style.transform = "scale(1)";
    }
  }
  function handlePopComplaint() {
    const forms = document.getElementsByClassName("popComplaint");
    for (let i = 0; i < forms.length; i++) {
      forms[i].style.transform = "scale(1)";
    }
  }
  const [userData, setUserData] = useState(null);
  const [img, setImg] = useState(null);

  const getUserData = async () => {
    try {
      const userResponse = await axios.get(
        "https://campus-mate.onrender.com/student/showdata",
        {
          withCredentials: true, // Include credentials for cookies
        }
      );
      // console.log(userResponse.data.user.name);
      setUserData(userResponse.data.user.name);
      setImg(userResponse.data.user.img);
    } catch (err) {
      console.log(err);
    }
  };

  const checkRoomBookingStatus = async () => {
    try {
      const response = await axios.get(
        "https://campus-mate.onrender.com/student/isBooked",
        {
          withCredentials: true, // Include credentials for cookies
        }
      );
      setIsRoomBooked(response.data.isRoomBooked);
      console.log(response.data.isRoomBooked); // Update booking status
    } catch (err) {
      console.error("Error fetching room booking status:", err);
    }
  };

  if (!userData) {
    getUserData();
    checkRoomBookingStatus();
  }

  return (
    <div className="overflow-hidden">
      <section className="main_page w-screen">
        <Navbar />
        <div className="flex items-center justify-center w-full">
          <div
            className="relative h-[70vh] w-[80vw] my-[2vh] rounded-3xl overflow-hidden flex flex-col items-center gap-20 px-10"
            style={{
              backgroundImage: "url(/about.webp)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="w-full h-full bg-black absolute opacity-50"></div>

            <div className="flex gap-x-10">
              <h1 className="text-[5rem] font-bold hidden lg:block z-20 text-yellow-50">
                Welcome<span className="text-pink-500">!</span>
              </h1>
              <h1 className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] font-bold z-20 text-yellow-50">
                {userData}
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-x-20">
              <div className="flex flex-col items-center gap-2 md:gap-10">
                <p className="text-xl hidden lg:block text-white z-20 font-semibold">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia
                  non accusamus cum vel alias est repellendus sunt fugit neque
                  libero amet quis quos, debitis quibusdam nam illum sapiente
                  provident nesciunt?
                </p>
              </div>
              <div className="flex flex-col items-center gap-20 text-white z-20 font-semibold">
                <p className="text-xl hidden lg:block text-right">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia
                  non accusamus cum vel alias est repellendus sunt fugit neque
                  libero amet quis quos, debitis quibusdam nam illum sapiente
                  provident nesciunt?
                </p>
                <button className="bg-pink-500 text-white h-10 px-8 rounded-3xl z-20">
                  Book Room
                </button>
              </div>
            </div>
            <div className="absolute overflow-hidden w-[40vw] h-[40vw] lg:w-[25vw] lg:h-[25vw] bg-black rounded-full left-[35vw] lg:left-[35%] bottom-40 lg:-bottom-20 border-white border-8 z-20">
              <img
                className="w-full h-full object-cover"
                src={img}
                alt="Image inside circular div"
              />
            </div>
          </div>
        </div>
        {/* <Hero/> */}

        <section
          class="section__container about__container flex flex-wrap"
          id="gatepass"
        >
          <div class="about__content">
            <p class="section__subheader">GATEPASS</p>
            <h2 class="section__header">Ticket to go out of the Campus</h2>
            <p class="section__description">
              With a focus on quality accommodations, personalized experiences,
              and seamless booking, our platform is dedicated to ensuring that
              every traveler embarks on their dream holiday with confidence and
              excitement.
            </p>
            <div class="about__btn">
              <button class="btn" onClick={handlePopGate}>
                Apply Gatepass
              </button>
            </div>
          </div>
          <div class="about__image">
            <img src="/9557011.jpg" alt="about" />
          </div>
        </section>

        <MarqueeComponent />

        <section
          class="section__container about__container flex flex-wrap"
          id="complaint"
        >
          <div class="about__image">
            <img src="/complaint.jpg" alt="about" />
          </div>
          <div class="about__content">
            <p class="section__subheader">COMPLAINTS</p>
            <h2 class="section__header">Nothing goes unheard !</h2>
            <p class="section__description">
              With a focus on quality accommodations, personalized experiences,
              and seamless booking, our platform is dedicated to ensuring that
              every traveler embarks on their dream holiday with confidence and
              excitement.
            </p>
            <div class="about__btn">
              <button class="btn" onClick={handlePopComplaint}>
                Raise a complaint
              </button>
            </div>
          </div>
        </section>

        <section class="explore" id="explore">
          <p class="section__subheader">EXPLORE</p>
          <h2 class="section__header">What's New Today.</h2>
          <div class="explore__bg relative">
            <div className="black-div"></div>
            <div class="explore__content">
              <p class="section__description">10th Dec 2024</p>
              <h4>A New Mess Menu Is Available In Our Hostels.</h4>
              <NavLink to="/student/mess">
                <button class="btn">View Menu</button>
              </NavLink>
            </div>
          </div>
        </section>

        <Footer page="subpage" />
      </section>

      <div className="popForm popBook scale-0">
        <Bookings />
      </div>
      <div className="popForm popComplaint scale-0">
        <Complaint />
      </div>
      <div className="popForm popGate scale-0">
        <Gatepass />
      </div>
    </div>
  );
}

export default StudentLandingPage;
