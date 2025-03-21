import { NextResponse } from "next/server"
import { fetchWithAuth } from "@/lib/auth"

const API_BASE_URL = "http://20.244.56.144/test"

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const postId = params.postId

  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/${postId}/comments`, {
      cache: "no-store", // Don't cache the response
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in comments API route for post ${postId}:`, error)
    return NextResponse.json({ error: `Failed to fetch comments for post ${postId}` }, { status: 500 })
  }
}

