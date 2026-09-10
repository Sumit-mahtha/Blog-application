'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Header = () => {
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('email', email);
      const response = await axios.post('/api/email', formData);
      if (response.data.success) {
        toast.success(response.data.msg || 'Email submitted successfully');
        setEmail("");
      } else {
        toast.error(response.data.msg || 'Error subscribing email');
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.response?.data?.msg || error.message || 'Error subscribing email');
    }
  };

  return (
    <div className='py-5 px-5 lg:px-28'>
      <div className='flex justify-between items-center'>
        <Link href='/'>
          <Image 
            src={assets.logo}
            width={180}
            height={50}
            alt='blogger' 
            className='w-[130px] sm:w-auto cursor-pointer'
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
        <Link 
          href='/admin/addProduct'
          className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000] cursor-pointer'
        >
          Get started
          <Image 
            src={assets.arrow}
            width={20}
            height={20}
            alt='arrow'
          />
        </Link>
      </div>
      <div className='text-center my-8'>
        <h1 className='text-3xl sm:text-5xl font-medium '>Latest Blogs</h1>
        <p className='mt-10 max-w-[740px] mx-auto text-xs sm:text-base'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <form onSubmit={onSubmitHandler} className='flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black' action="">
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            type="email" 
            placeholder='Enter your email' 
            className='pl-4 outline-none w-full' 
            required
          />
          <button type="submit" className='border-1 border-black py-2 px-4 sm:px-8 active:bg-gray-600 active:text-white'>Subscribe</button>
        </form>
      </div>
    </div>
  )
}

export default Header