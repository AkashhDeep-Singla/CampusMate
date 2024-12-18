import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    enrollmentID: "",
    image: null,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert("Passwords don't match");
      return;
    }
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("enrollmentID", formData.enrollmentID);
    console.log(formData);
    if (formData.image) data.append("image", formData.image);
    console.log(formData);
    try {
      const response = await axios.post(
        "https://campus-mate.onrender.com/student/signup",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert("User registered successfully!");
      localStorage.setItem("enrollmentID", formData.enrollmentID);
      console.log("Registered user:", response.data);
      navigate("/student");
    } catch (err) {
      console.error("Error during registration:", err);
      const errorMsg =
        err.response?.data?.msg || "An error occurred during registration.";
      alert(errorMsg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(
        name === "password"
          ? value === formData.confirmPassword.trim()
          : value === formData.password.trim()
      );
    }
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  return (
    <div className="w-fuull h-screen flex justify-center items-center bg-[#DFC9AC] font-sans">
      <div className="relative grid grid-cols-1 md:grid-cols-2 h-[85%] w-[70%] bg-white items-center px-10 rounded-xl">
        <Link
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
          className="absolute top-2 left-2"
          to="/"
        >
          <button className="absolute z-20 md:px-7 md:py-3 px-5 py-2 text-white text-xl rounded-lg top-2 left-2 bg-[#383433]">
            Home
          </button>
        </Link>
        <div className="w-[90%] h-[90%] flex flex-col items-center rounded-xl gap-20">
          <h1 className="text-3xl font-bold mt-10">Sign Up</h1>
          <div className="flex flex-col w-[80%] gap-5">
            <input
              type="text"
              className=" bg-white focus:outline-none border-2 focus:border-pink-500 h-12 rounded-lg px-5"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="number"
              className=" bg-white focus:outline-none border-2 focus:border-pink-500 h-12 rounded-lg px-5"
              placeholder="EnrollmentID"
              name="enrollmentID"
              value={formData.enrollmentID}
              onChange={handleChange}
            />
            <input
              type="text"
              className=" bg-white focus:outline-none border-2 focus:border-pink-500 h-12 rounded-lg px-5"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="relative w-full  h-12 rounded-lg">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className=" bg-white focus:outline-none border-2 focus:border-pink-500 h-12 rounded-lg px-5 w-full"
              />
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            </div>
            <div className="relative w-full mb-5 h-12 rounded-lg">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className=" bg-white focus:outline-none border-2 focus:border-pink-500 h-12 rounded-lg px-5 w-full"
              />
              <FontAwesomeIcon
                icon={confirmPasswordVisible ? faEyeSlash : faEye}
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            </div>
            <input
              type="file"
              className=" items-center"
              onChange={handleImageChange}
            />
            <button
              className="mt-4 bg-[#383433] text-white h-12 rounded-lg hover:bg-white hover:text-pink-400 border-2 hover:outline-none hover:border-pink-400 transition-all duration-100 "
              onClick={handleSignUp}
            >
              Create Account
            </button>
          </div>
          <p className="font-semibold ">
            Already have an account ?{" "}
            <Link to="/student-login" className="text-pink-400 font-semibold">
              Login !
            </Link>
          </p>
        </div>
        <div
          className="w-[90%] h-[90%] hidden md:block rounded-xl"
          style={{
            backgroundImage: "url('/login.png')",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SignUp;
