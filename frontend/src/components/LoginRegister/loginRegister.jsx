import React, { useState } from 'react';
import './loginRegister.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function RegisterLogin() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        enrollmentID: '',
        image: null, // For image file upload
    });

    const [loginData, setLoginData] = useState({
        enrollmentID: '',
        password: '',
    });

    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const makeActive = () => {
        setIsActive(true);
    };

    const removeActive = () => {
        setIsActive(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!passwordMatch) {
            alert("Passwords don't match");
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('enrollmentID', formData.enrollmentID);
        if (formData.image) data.append('image', formData.image);

        try {
            const response = await axios.post(
                'https://campus-mate.onrender.com/student/signup',
                data,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );
            alert('User registered successfully!');
            localStorage.setItem('enrollmentID', formData.enrollmentID);
            console.log('Registered user:', response.data);
            navigate('/student');
        } catch (err) {
            console.error('Error during registration:', err);
            const errorMsg = err.response?.data?.msg || 'An error occurred during registration.';
            alert(errorMsg);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://campus-mate.onrender.com/student/login',
                loginData,
                { withCredentials: true }
            );
            alert('Login successful!');
            navigate('/student');
        } catch (err) {
            console.error('Error during login:', err);
            const errorMsg = err.response?.data?.msg || 'An error occurred during login.';
            alert(errorMsg);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordMatch(
                name === 'password' ? value === formData.confirmPassword.trim() : value === formData.password.trim()
            );
        }
    };

    const handleImageChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0], // Capture the file object
        }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="logMain">
            <div className={isActive ? 'logContainer active' : 'logContainer'}>
                {/* Signup Form */}
                <div className="form-logContainer sign-up">
                    <form onSubmit={handleSignUp}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="enrollmentID"
                            placeholder="Enrollment ID"
                            value={formData.enrollmentID}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div className="relative w-full">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <FontAwesomeIcon
                                icon={passwordVisible ? faEyeSlash : faEye}
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            />
                        </div>
                        <div className="relative w-full">
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <FontAwesomeIcon
                                icon={confirmPasswordVisible ? faEyeSlash : faEye}
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            />
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                {/* Login Form */}
                <div className="form-logContainer sign-in">
                    <form onSubmit={handleSignIn}>
                        <h1>Sign In</h1>
                        <input
                            type="number"
                            name="enrollmentID"
                            placeholder="Enrollment ID"
                            value={loginData.enrollmentID}
                            onChange={handleLoginChange}
                        />
                        <div className="relative w-full">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                            />
                            <FontAwesomeIcon
                                icon={passwordVisible ? faEyeSlash : faEye}
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            />
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                {/* Toggle Section */}
                <div className="toggle-logContainer">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of the site's features</p>
                            <button className="hider" onClick={removeActive}>
                                Sign In
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of the site's features</p>
                            <button className="hider" onClick={makeActive}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterLogin;
