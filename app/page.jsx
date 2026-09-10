'use client'
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import BlogList from "@/Components/BlogList";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <>
      <ToastContainer theme="dark"/>
      <Header />
      <BlogList />
      <Footer />
    </>
  );
}
