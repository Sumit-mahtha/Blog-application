'use client'
import React, { useEffect, useState } from "react";
import BlogTableItem from "@/Components/AdminComponents/BlogTableItem";
import axios from "axios";
import { toast } from "react-toastify";

const Page = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog');
            if (response.data.success) {
                setBlogs(response.data.blogs || []);
            }
        } catch (error) {
            console.error("Error fetching blogs for admin list:", error);
        }
    };

    const deleteBlog = async (mongoId) => {
        try {
            const response = await axios.delete('/api/blog', {
                params: { id: mongoId }
            });
            if (response.data.success) {
                toast.success(response.data.msg);
                fetchBlogs();
            } else {
                toast.error("Error deleting blog");
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete blog");
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
            <h1 className="text-xl font-semibold">All blogs</h1>
            <div className='relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-sm text-gray-700 text-left uppercase bg-gray-50'>
                        <tr>
                            <th scope='col' className='hidden sm:table-cell px-6 py-3'>
                                Author name
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Blog Title
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Date
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((item, index) => {
                            return (
                                <BlogTableItem 
                                    key={index} 
                                    mongoId={item._id} 
                                    title={item.title} 
                                    author={item.author} 
                                    authorImg={item.authorImg} 
                                    date={item.date} 
                                    deleteBlog={deleteBlog} 
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;