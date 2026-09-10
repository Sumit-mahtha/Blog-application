import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await ConnectDB();
        const formData = await request.formData();
        const email = formData.get('email');

        if (!email) {
            return NextResponse.json({ success: false, msg: "Email is required" }, { status: 400 });
        }

        const emailData = {
            email: `${email}`
        };

        await EmailModel.create(emailData);
        return NextResponse.json({ success: true, msg: "Email Subscribed" });
    } catch (error) {
        console.error("POST /api/email error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, msg: "Email already subscribed" }, { status: 400 });
        }
        return NextResponse.json({ success: false, msg: error.message || "Failed to subscribe" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await ConnectDB();
        const emails = await EmailModel.find({});
        return NextResponse.json({ success: true, emails });
    } catch (error) {
        console.error("GET /api/email error:", error);
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await ConnectDB();
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, msg: "ID is required" }, { status: 400 });
        }
        await EmailModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true, msg: "Email Deleted" });
    } catch (error) {
        console.error("DELETE /api/email error:", error);
        return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
    }
}