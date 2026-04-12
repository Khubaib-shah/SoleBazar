import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET_KEY!
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json({ error: "Failed to sign request" }, { status: 500 });
  }
}
