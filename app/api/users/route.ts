import { NextResponse } from "next/server"
import { fetchWithAuth } from "@/lib/auth"

const API_BASE_URL = "http://20.244.56.144/test"

export async function GET() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/users`, {
      cache: "no-store", // Don't cache the response
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in users API route:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

