import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import "../repeatPop.css";

const Bookings = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    enrollmentNumber: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    parentname: "",
    parentphone: "",
    parentEmail: "",
    roomtype: "",
    hostelname: "",
    roomseater: "",
    roomfloor: "",
  });
  const [termsAgreed, setTermsAgreed] = useState(false);

  const hostelNames = {
    Female: {
      "Attach Bathroom Non AC": ["IBN-A", "IBN-B", "IBN-C"],
      "Common Bathroom Non AC": ["Pie-A", "Pie-B", "Pie-C"],
      "Attach Bathroom With AC": ["Nightingale-A", "Nightingale-B"],
      "Common Bathroom With AC": ["Vasco"],
    },
    Male: {
      "Attach Bathroom Non AC": ["Colambus"],
      "Common Bathroom Non AC": ["Armstrong"],
      "Attach Bathroom With AC": ["Franklin"],
      "Common Bathroom With AC": ["Marco Polo"],
    },
  };

  const images = [
    {
      src: "https://images.pexels.com/photos/7969098/pexels-photo-7969098.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Capture the Beauty",
    },
    {
      src: "https://images.pexels.com/photos/4907235/pexels-photo-4907235.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      src: "https://images.pexels.com/photos/7969094/pexels-photo-7969094.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  useEffect(() => {
    gsap.fromTo(
      ".signup-container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline
      .to(".signup-image", {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.1,
      })
      .set(".signup-image", { opacity: 0, scale: 0.8 })
      .to(`.signup-image:nth-child(${currentImage + 1})`, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power4.out",
      });
  }, [currentImage]);

  const handleSlide = (index) => {
    if (index !== currentImage) {
      setCurrentImage(index);
    }
  };


const handleNextStep = () => {
  // Validation for each step
  const validateStep = () => {
    if (step === 1) {
      // Validation for step 1
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.enrollmentNumber.trim() !== ""
      );
    } else if (step === 2) {
      // Validation for step 2
      return (
        formData.gender.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.address.trim() !== "" &&
        formData.city.trim() !== "" &&
        formData.state.trim() !== "" &&
        formData.country.trim() !== ""
      );
    } else if (step === 3) {
      // Validation for step 3
      return (
        formData.parentname.trim() !== "" &&
        formData.parentphone.trim() !== "" &&
        formData.parentEmail.trim() !== ""
      );
    } else if (step === 4) {
      // Validation for step 4
      return (
        formData.roomtype.trim() !== "" &&
        formData.hostelname.trim() !== "" &&
        formData.roomseater.trim() !== "" &&
        formData.roomfloor.trim() !== "" &&
        termsAgreed
      );
    }
    return true; // Default to true for steps without validation
  };

  if (validateStep()) {
    setStep(step + 1); // Proceed to the next step if validation passes
  } else {
    alert("Please fill out all required fields before proceeding."); // Display error message
  }
};


  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = () => {
    setTermsAgreed(!termsAgreed);
  };

  const handleSubmit = async () => {
    if (!termsAgreed) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    try {
      const response = await axios.post(
        "https://campus-mate.onrender.com/reservation",
        formData,
        { withCredentials: true }
      );
      alert("Your request has been sent will let you know about the room");
      navigate("/student/booking/payment");
    } catch (error) {
      console.error("Error in Booking", error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      alert(errorMessage);
    }
  };

  function handlePopClose() {
    const forms = document.getElementsByClassName("popForm");
    for (let i = 0; i < forms.length; i++) {
      forms[i].style.transform = "scale(0)";
    }
  }

  return (
    <div className="fixer">
      <div className="black__div"></div>
      <div className="w-full h-screen bg-transparent flex items-center justify-center main_form">
        <div className="signup-container w-[70%] h-[70%] bg-white rounded-2xl flex p-2 px-2 relative gap-3">
          <p className="absolute z-10 text-white bottom-0 text-[70px] font-montserrat my-20 mx-[50px] font-bold block text-center">
            CampusMate
          </p>
          <div className="w-full h-full relative rounded-2xl overflow-hidden">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={`Slide ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity rounded-2xl signup-image ${currentImage === index ? "opacity-100" : "opacity-0"
                  }`}
                style={{
                  transition:
                    "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                }}
              />
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlide(index)}
                  className={`w-6 h-3 rounded-full ${currentImage === index ? "bg-white" : "bg-white/50"
                    } transition-all duration-300`}
                ></button>
              ))}
            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-between font-montserrat gap-2 p-5">
            {step === 1 && (
              <div className="flex flex-col gap-5 justify-between">
                <div className="flex justify-between">
                  <h1 className="text-[40px]">Book a room</h1>
                  <button onClick={handlePopClose}>X</button>
                </div>
                <div className="w-full h-full flex flex-col gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      name="firstName"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="lastName"
                      className="flex-1 border-black border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex">
                    <input
                      name="email"
                      className="border-black border-solid border-[2px] p-5 rounded-2xl w-full"
                      type="text"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      name="enrollmentNumber"
                      className="border-black border-solid border-[2px] p-5 rounded-2xl w-full"
                      type="text"
                      placeholder="University RollNo."
                      value={formData.enrollmentNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="w-full h-full flex items-end">
                  <button
                    onClick={handleNextStep}
                    className="w-full text-[30px] text-white bg-[#e82574] p-3 rounded-2xl hover:bg-[#bc1c5c] transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-10 justify-between">
                <div className="flex justify-between">
                  <h1 className="text-[40px]">Pesonal Details</h1>
                  <button onClick={handlePopClose}>X</button>
                </div>
                <div className="flex flex-col gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <select
                      name="gender"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <input
                      name="phone"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      name="address"
                      className="flex-1 border-black border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="city"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      name="state"
                      className="flex-1 border-black border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="country"
                      className="flex-1 border-black border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4 gap-3">
                  <button
                    onClick={handlePreviousStep}
                    className="w-full text-[30px] text-white bg-gray-500 p-3 rounded-2xl hover:bg-gray-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="w-full text-[30px] text-white bg-[#e82574] p-3 rounded-2xl hover:bg-[#bc1c5c] transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-10 justify-between">
                <div className="flex justify-between">
                  <h1 className="text-[40px]">Parents Details</h1>
                  <button onClick={handlePopClose}>X</button>
                </div>
                <div className="flex flex-col gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      name="parentname"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Parent's Name"
                      value={formData.parentname}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="parentphone"
                      className="flex-1 border-black border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Parent's Ph. No."
                      value={formData.parentphone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      name="parentEmail"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Parent's Email ID"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4 gap-3">
                  <button
                    onClick={handlePreviousStep}
                    className="w-full text-[30px] text-white bg-gray-500 p-3 rounded-2xl hover:bg-gray-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="w-full text-[30px] text-white bg-[#e82574] p-3 rounded-2xl hover:bg-[#bc1c5c] transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-10 justify-between">
                <div className="flex justify-between">
                  <h1 className="text-[40px]">Select a room</h1>
                  <button onClick={handlePopClose}>X</button>
                </div>
                <div className="flex flex-col gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <select
                      name="roomtype"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Room Type"
                      value={formData.roomtype}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Room Type</option>
                      <option value="Attach Bathroom Non AC">
                        Attach Bathroom Non AC
                      </option>
                      <option value="Common Bathroom Non AC">
                        Common Bathroom Non AC
                      </option>
                      <option value="Attach Bathroom With AC">
                        Attach Bathroom With AC
                      </option>
                      <option value="Common Bathroom With AC">
                        Common Bathroom With AC
                      </option>
                    </select>
                    <select
                      name="hostelname"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Hostel Name"
                      value={formData.hostelname}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Hostel Name</option>
                      {hostelNames[formData.gender]?.[formData.roomtype]?.map(
                        (hostel, index) => (
                          <option key={index} value={hostel}>
                            {hostel}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      name="roomseater"
                      className="flex-1 border-black border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Room Seater"
                      value={formData.roomseater}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Room Seater</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    <select
                      name="roomfloor"
                      className="border-black flex-1 border-solid border-[2px] p-5 rounded-2xl"
                      type="text"
                      placeholder="Room Floor"
                      value={formData.roomfloor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Room Floor</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 text-[15px]">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={handleCheckboxChange}
                      required
                    />
                    <h1>
                      I agree to <a href="#">Terms & Conditions</a>
                    </h1>
                  </div>
                </div>
                <div className="flex justify-between mt-4 gap-3">
                  <button
                    onClick={handlePreviousStep}
                    className="w-full text-[30px] text-white bg-gray-500 p-3 rounded-2xl hover:bg-gray-700 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-full text-[30px] text-white bg-[#e82574] p-3 rounded-2xl hover:bg-[#bc1c5c] transition-all"
                  >
                    Book
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
