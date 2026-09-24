'use client'
import AiSummarizer from '@/Components/AISummarizer';
import { blog_data, assets } from '@/Assets/assets';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';                       
import Link from 'next/link';                        
import axios from 'axios';

const Page = ({ params }) => {
    const { id } = React.use(params);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            // If id is a numeric ID (from static blog_data sample data), load from blog_data directly
            const numericId = Number(id);
            if (!isNaN(numericId) && numericId > 0 && numericId <= 100) {
                const staticBlog = blog_data.find(item => item.id === numericId);
                if (staticBlog) {
                    setData(staticBlog);
                    return;
                }
            }

            try {
                const response = await axios.get('/api/blog', {
                    params: { id }
                });
                if (response.data && response.data.blog) {
                    setData(response.data.blog);
                    return;
                }
            } catch {
                console.warn("Database fetch returned an error, checking static blog_data as fallback");
            }

            // Fallback for static mock blogs
            const fallback = blog_data.find(item => String(item.id) === String(id));
            if (fallback) {
                setData(fallback);
            }
        };

        if (id) {
            fetchBlogData();
        }
    }, [id]);

    return (data ? <>
        <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
            <div className='flex justify-between items-center'>
                <Link href='/'>
                    <Image src={assets.logo} width={130} height={40} alt='' className='w-[130px] sm:w-auto cursor-pointer' style={{ width: 'auto', height: 'auto' }} />
                </Link>
                <Link 
                    href='/admin/addProduct'
                    className='flex items-center gap-2 font-medium py-1 px-3 sm:px-6 border border-black shadow-[-7px_7px_0px_0px_#000000] cursor-pointer'
                >
                    Get Started<Image src={assets.arrow} width={20} height={20} alt='' />
                </Link>
            </div>
            <div className='text-center my-24'>
                <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
                <Image className='mx-auto mt-6 border border-white rounded-full' src={data.authorImg || data.author_img || assets.profile_icon} width={60} height={60} alt='' />
                <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
            </div>
        </div>
        <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
            <Image className='border-4' src={data.image} width={1280} height={720} alt='' unoptimized={typeof data?.image === 'string' && data.image.startsWith('data:')} />
            <AiSummarizer title={data.title} content={data.description || data.content || data.title} />
            <h1 className='my-8 text-[26px] font-semibold'>Introduction</h1>
            <div className='blog-content text-gray-700 leading-relaxed' dangerouslySetInnerHTML={{ __html: data.description || data.content || "" }} />
                
            <div className='my-24'>
                <p className='text-black font font-semibold my-4'>Share this article on social media:</p>
                <div className='flex items-center gap-4'>
                    <Image src={assets.facebook_icon} width={50} height={50} alt='' />
                    <Image src={assets.twitter_icon} width={50} height={50} alt='' />
                    <Image src={assets.googleplus_icon} width={50} height={50} alt='' />
                </div>
            </div>
        </div>
    </> : <></>
    )
}

export default Page