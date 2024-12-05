import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './gateLogin.css'
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function MessLogin() {

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://hostel-sync-1.onrender.com/gateSecurity/login",
        loginData, {
        withCredentials: true
      }
      );
      console.log("The response is ", response.data)
      alert("Login successful!");
      navigate("/qrscanner");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
        class="messContainer active"
        id="messContainer"
      >
        <div className="flex items-center justify-center"><button onClick={handleHomeClick}>Go to Home</button></div>
        <form onSubmit={handleSignIn} className="w-[500px]">
          <h1>Sign In</h1>
          <input
            type="email"
            name="email"
            id="wmail"
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
          <a href="#">Forget Your Password?</a>
          <button>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default MessLogin;