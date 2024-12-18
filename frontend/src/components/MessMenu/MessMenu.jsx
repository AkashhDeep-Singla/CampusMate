import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const UserMess = () => {
    const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState("");
  const [desc, setDesc] = useState("");

  const handleShowMenu = async (e) => {
    try {
      const response = await axios.get(
        "https://campus-mate.onrender.com/student/showMenu",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setImgUrl(response.data.imageUrl);
        setDesc(response.data.description);
      }
    } catch (e) {
      const error = e.response?.data?.msg;
      alert(error);
    }
  };
  useEffect(() => {
    if (!imgUrl && !desc) {
      handleShowMenu();
    }
  }, [imgUrl, desc]);

  const handleBack = () => {
    navigate("/student");
  };

  return (
    <div className="flex flex-col gap-3 h-screen w-full relative items-center justify-center">
      <div>
        <button
          onClick={handleBack}
          className=" mb-4 px-4 py-2 bg-white text-black rounded flex items-center justify-center gap-2 absolute top-5 left-5 "
        >
          <IoArrowBack /> Back
        </button>
      </div>
      <p className="h-[100px]  text-[50px]">{desc}</p>
      <img
        src={imgUrl}
        alt="The Menu Will be soon uploaded my Warden"
        className="h-[80vh] w-[80vw]"
      />
    </div>
  );
};

export default UserMess;
