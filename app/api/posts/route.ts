import { NextResponse } from "next/server"
import { fetchWithAuth } from "@/lib/auth"

const API_BASE_URL = "http://20.244.56.144/test"

export async function GET() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts`, {
      cache: "no-store", // Don't cache the response
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const data = await response.json()

    // Add timestamp for sorting (in a real app, this would come from the API)
    const postsWithTimestamp = data.posts.map((post: any) => ({
      ...post,
      timestamp: Date.now() - Math.floor(Math.random() * 1000000), // Mock timestamp
    }))

    return NextResponse.json({ posts: postsWithTimestamp })
  } catch (error) {
    console.error("Error in posts API route:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

