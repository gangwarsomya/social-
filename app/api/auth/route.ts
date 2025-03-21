import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/auth"

export async function GET() {
  try {
    // Get a valid authentication token
    const token = await getAuthToken()

    return NextResponse.json({
      status: "authenticated",
      message: "Authentication successful",
    })
  } catch (error) {
    console.error("Error in auth API route:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Authentication failed",
      },
      { status: 500 },
    )
  }
}

