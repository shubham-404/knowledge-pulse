import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Here you would normally save the user to a database (Prisma, MongoDB, etc.)
    console.log("Received signup data:", body);

    return NextResponse.json(
      { success: true, message: "Account created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request data" },
      { status: 400 }
    );
  }
}