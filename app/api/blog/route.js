import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel"
import { NextResponse } from "next/server"

// API endpoint to get all blogs or single blog by id
export async function GET(request) {
    try {
        await ConnectDB();
        const blogId = request.nextUrl.searchParams.get("id");
        if (blogId) {
            const blog = await BlogModel.findById(blogId);
            return NextResponse.json({ success: true, blog });
        } else {
            const blogs = await BlogModel.find({});
            return NextResponse.json({ success: true, blogs });
        }
    } catch (error) {
        console.error("GET /api/blog error:", error);
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}

// API endpoint for uploading blogs
export async function POST(request) {
    try {
        await ConnectDB();
        const formData = await request.formData();

        const image = formData.get('image');
        if (!image || typeof image === 'string' || typeof image.arrayBuffer !== 'function') {
            return NextResponse.json({ success: false, msg: "Valid image file is required" }, { status: 400 });
        }

        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        
        // Convert to Base64 data URL for compatibility with Vercel/serverless environments
        const mimeType = image.type || 'image/jpeg';
        const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

        const blogData = {
            title: `${formData.get('title')}`,
            description: `${formData.get('description')}`,
            category: `${formData.get('category')}`,
            author: `${formData.get('author')}`,
            image: base64Image,
            authorImg: `${formData.get('authorImg')}`,
        }

        await BlogModel.create(blogData);
        console.log("Blog Saved");
        return NextResponse.json({ success: true, msg: "Blog Added" });
    } catch (error) {
        console.error("API POST error:", error);
        return NextResponse.json({ success: false, msg: error.message || "Failed to save blog" }, { status: 500 });
    }
}

// API endpoint to delete blog
export async function DELETE(request) {
    try {
        await ConnectDB();
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, msg: "ID is required" }, { status: 400 });
        }
        await BlogModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true, msg: "Blog Deleted" });
    } catch (error) {
        console.error("DELETE /api/blog error:", error);
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}