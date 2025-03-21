// Types
export interface User {
  id: string
  name: string
}

export interface Post {
  id: number
  userid: number
  content: string
  timestamp?: number // We'll add this for sorting
}

export interface Comment {
  id: number
  postid: number
  content: string
}

export interface UsersResponse {
  users: Record<string, string>
}

export interface PostsResponse {
  posts: Post[]
}

export interface CommentsResponse {
  comments: Comment[]
}

// Fetch users
export async function fetchUsers(): Promise<User[]> {
  try {
    // Use our Next.js API route instead of the external API directly
    const response = await fetch("/api/users")
    if (!response.ok) throw new Error("Failed to fetch users")

    const data: UsersResponse = await response.json()

    // Transform the users object into an array of User objects
    return Object.entries(data.users).map(([id, name]) => ({
      id,
      name,
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error // Re-throw to allow component to handle it
  }
}

// Fetch posts
export async function fetchPosts(): Promise<Post[]> {
  try {
    // Use our Next.js API route instead of the external API directly
    const response = await fetch("/api/posts")
    if (!response.ok) throw new Error("Failed to fetch posts")

    const data: PostsResponse = await response.json()
    return data.posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error // Re-throw to allow component to handle it
  }
}

// Fetch comments for a specific post
export async function fetchComments(postId: number): Promise<Comment[]> {
  try {
    // Use our Next.js API route instead of the external API directly
    const response = await fetch(`/api/comments/${postId}`)
    if (!response.ok) throw new Error(`Failed to fetch comments for post ${postId}`)

    const data: CommentsResponse = await response.json()
    return data.comments
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    throw error // Re-throw to allow component to handle it
  }
}

