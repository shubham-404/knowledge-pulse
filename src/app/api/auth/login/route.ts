import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, you would verify the email and password against your database here.
    console.log("Login attempt for:", body.email);

    // Mocking a successful login token/response
    return NextResponse.json(
      { success: true, message: "Logged in successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}