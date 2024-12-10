import React, { useEffect, useState } from 'react'
import { IoMail } from "react-icons/io5"
import { FaLinkedin } from "react-icons/fa"
import { NavLink } from 'react-router-dom'
import axios from 'axios'

const Footer = ({ page }) => {
  const [subscribed, setSubscribed] = useState("NO")

  useEffect(async () => {
    const response = await axios.get("https://campus-mate.onrender.com/isSubscribed", {
      withCredentials: true
    })
    console.log(response.data);
    setSubscribed(response.data)
  })

  const sendMail = async () => {
    try {
      await axios.get("https://campus-mate.onrender.com/newsletter", {
        withCredentials: true,
      })
      alert("You just Subscribed to our newsletter")
    } catch (error) {
      console.log(error.response?.data?.msg);
      alert(error.response?.data?.msg);
    }
  }

  return (
    <div id='contact' className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 bg-pink-100'>
      <div className='flex flex-col items-center justify-between'>
        <div className='w-full h-full flex flex-col items-center justify-center my-5'>
          <img width={300} className='' src="/logo-black-nobg.png" alt="" />
          <p className='text-[20px] font-montserrat' >Build Your Dreams With Us</p>
        </div>
        <div className='w-full h-full flex flex-col font-montserrat justify-center items-center gap-6 my-5'>
          <h1 className='text-[30px]'>Subscribe to our News</h1>
          <p className='w-[500px] text-gray-500 text-center'>Stay Informed and never miss a Beat.Subscribe to our Exclusive News Updates</p>
          {page != 'main' ?
            (subscribed == "YES" ? <p>Already Subscribed</p> : <button className='bg-gray-800 w-[250px] h-[50px] text-white rounded-xl' onClick={sendMail}>Subscribe</button>) : <p>Login First</p>}
        </div>
      </div>

      <div className='flex flex-col items-center justify-between'>
        <div className='flex flex-col items-center my-5'>
          <div>
            <h4 className='text-[25px] font-montserrat' >Quick Navigation</h4>
          </div>
          {page == 'main' ? <div className='flex flex-col font-montserrat text-[35px] font-bold gap-3'>
            <h1><a href="#">Home</a></h1>
            <h1><a href="#about">About</a></h1>
            <h1><a href="#rooms">Rooms</a></h1>
          </div> : <div className='flex flex-col font-montserrat text-[35px] font-bold gap-3'>
            <h1><a href='#'>Home</a></h1>
            <h1><NavLink to={'/student/my-gatepasses'}>Gatepasses</NavLink></h1>
            <h1><NavLink to={'/student/my-complaints'}>Complaints</NavLink></h1>
          </div>}
        </div>
        <div className='flex flex-col font-montserrat my-5'>
          <h1 className='text-[25px]'>Address :</h1>
          <p className='text-[20px] text-gray-600 w-[200px]'>Chitkara University Punjab 140001, Rajpura</p>
        </div>
      </div>

      <div className='flex flex-col justify-between'>
        <div className='flex flex-col items-center my-5'>
          <div className='flex gap-5 items-center justify-center'>
            <div>
              <h4 className='text-[15px]'>CampusMate Founders</h4>
              <h1 className='text-[20px] font-bold'>Team StackMasters</h1>
            </div>
          </div>
          <div className='text-[25px] font-semibold text-center'>
            We are here to change your future.
          </div>
          <div className='flex gap-7'>
            <NavLink to={'mailto:campusmate@gmail.com'}><IoMail className='text-[50px]' /></NavLink>
            <NavLink to={"https://www.linkedin.com/in/campusmate"}><FaLinkedin className='text-[50px]' /></NavLink>
          </div>
          <div className='text-[20px] text-gray-500'>Copyright @ 2024 CampusMate</div>
          <div className='flex gap-5'>
          </div>
        </div>
        <div className='flex flex-col items-center my-5'>
          <img src="https://res.cloudinary.com/dhwaifalx/image/upload/v1732710122/logo-campusMate_m90scm.png" alt="" className='w-20 mix-blend-color-burn' />
          <p className='text-[20px] font-semibold'>Terms of Policies</p>
          <p className='text-[20px] font-semibold'>Privacy Policy</p>
        </div>
      </div>
    </div>

  )
}

export default Footer
