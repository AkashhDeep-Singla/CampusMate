import axios from "axios";
import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const QRcode = () => {
  const navigate = useNavigate();
  const enrollmentID = localStorage.getItem("enrollmentID");
  const [QRurl, setQRurl] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchQRCodeAndData = async () => {
    try {
      const qrResponse = await axios.get(
        `https://campus-mate.onrender.com/get-qrcode/${enrollmentID}`,
        {
          withCredentials: true,
        }
      );
      setQRurl(qrResponse.data);
      console.log("QR Code:", qrResponse.data);

      const userResponse = await axios.get(
        "https://campus-mate.onrender.com/student/showData",
        {
          withCredentials: true,
        }
      );
      setUserData(userResponse.data.user);
      console.log("User Data:", userResponse.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleBack = () => {
    navigate("/student");
  };

  useEffect(() => {
    if (QRurl || userData) {
      gsap.to(".animated-div", { opacity: 1, duration: 1 });
    }
  }, [QRurl, userData]);

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4">
      {userData == null ? (
        <div>
          <div>
            <button
              onClick={handleBack}
              className=" mb-4 px-4 py-2 bg-white text-black rounded flex items-center justify-center gap-2 absolute top-5 left-5 "
            >
              <IoArrowBack /> Back
            </button>
          </div>

          <button
            className="fetch-button mb-4 px-4 py-2 bg-white text-black rounded"
            onClick={fetchQRCodeAndData}
          >
            Fetch QR Code & User Data
          </button>
        </div>
      ) : null}

      {userData == null ? null : (
        <div
          className="flex flex-wrap w-full h-[60%] items-center justify-center bg-white rounded-[10px] animated-div"
          style={{ opacity: 0 }}
        >
          {QRurl ? (
            <img
              width={200}
              height={200}
              className="w-[200px] h-[200px]"
              src={QRurl}
              alt="QR Code"
            />
          ) : null}

          {userData ? (
            <div className="bg-white rounded-lg shadow-lg flex max-w-md justify-center items-center">
              <div className="flex flex-1 flex-col justify-center p-5 ">
                <h2 className="text-lg font-bold mb-4 text-center">
                  User Data
                </h2>
                <p>
                  <strong>Enrollment ID:</strong> {userData.enrollmentID}
                </p>
                <p>
                  <strong>Name:</strong> {userData.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
              </div>
              <div className="img_holder w-45 h-45 rounded-md overflow-hidden">
                <img
                  src={userData.img}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default QRcode;
