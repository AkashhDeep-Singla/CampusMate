import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../messLogin/messLogin.css'
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function MessLogin() {
  const [formData, setFormData] = useState({
    name: "", // Changed from name to match backend
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "", // Changed from name to match backend
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);

  const makeActive = () => {
    setIsActive(true);
  };

  const removeActive = () => {
    setIsActive(false);
  };


  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://campus-mate.onrender.com/mess/login",
        loginData, {
        withCredentials: true
      }
      );
      localStorage.setItem("token", response.data.token); // Store token
      alert("Login successful!");
      navigate("/guard/scanner");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  }

  const handleChangeAgain = (e) => {
    const { name, value } = e.target;
    setLoginData(() => ({
      ...loginData,
      [name]: value,
    }));
  };

  return (
    <div className="logMain">
      <div
        class={isActive ? "messContainer active " : "messContainer"}
        id="messContainer"
      >
        <div className="flex items-center justify-center"><button onClick={handleHomeClick}>Go to Home</button></div>
        {/* <div class="form-messContainer sign-in"> */}
        <form onSubmit={handleSignIn} className="w-[500px]">
          <h1>Sign In</h1>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChangeAgain}
            value={loginData.email}
            placeholder="Email"
          />
          <div className='relative w-[100%]'>
            <input type={passwordVisible ? "text" : "password"} name="password" id='password' onChange={handleChangeAgain} value={loginData.password} placeholder="Password" />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-500"
            />
          </div>
          <button>Sign In</button>
        </form>
        {/* </div> */}
        <div class="toggle-panel toggle-left">
          <h1>Welcome Back!</h1>
          <p>Enter your personal details to use all of site features</p>
          <button class="hider" id="login" onClick={removeActive}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessLogin;
