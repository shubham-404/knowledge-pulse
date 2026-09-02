import { NextResponse } from "next/server";

export async function GET() {
  // Mocking a successful logged-in user response
  return NextResponse.json(
    {
      user: {
        id: "usr_123456789",
        name: "Jane Doe",
        email: "jane@example.com",
        createdAt: new Date().toISOString(),
      },
    },
    { status: 200 }
  );
}