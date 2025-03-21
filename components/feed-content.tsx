"use client"

import { useState, useEffect, useRef } from "react"
import { fetchPosts, fetchUsers, type Post, type User } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostWithUser extends Post {
  userName: string
}

export default function FeedContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map())
  const [refreshing, setRefreshing] = useState(false)

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true)

  // Function to load posts
  const loadPosts = async () => {
    try {
      setRefreshing(true)

      // Fetch posts
      const fetchedPosts = await fetchPosts()

      // If we don't have users yet, fetch them
      let users = userMap
      if (userMap.size === 0) {
        const fetchedUsers = await fetchUsers()
        users = new Map(fetchedUsers.map((user: User) => [user.id, user.name]))
        if (isMounted.current) {
          setUserMap(users)
        }
      }

      // Combine posts with user names
      const postsWithUsers = fetchedPosts.map((post: Post) => ({
        ...post,
        userName: users.get(post.userid.toString()) || "Unknown User",
      }))

      // Sort by timestamp (newest first)
      const sortedPosts = postsWithUsers.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

      if (isMounted.current) {
        setPosts(sortedPosts)
        setLoading(false)
      }
    } catch (err) {
      if (isMounted.current) {
        setError("Failed to load feed. Please try again later.")
        console.error(err)
      }
    } finally {
      if (isMounted.current) {
        setRefreshing(false)
      }
    }
  }

  // Initial data load
  useEffect(() => {
    loadPosts()

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      if (isMounted.current && !refreshing) {
        loadPosts()
      }
    }, 30000) // Poll every 30 seconds

    return () => {
      isMounted.current = false
      clearInterval(intervalId)
    }
  }, [refreshing])

  const handleRefresh = () => {
    loadPosts()
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading feed...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={handleRefresh} className="px-4 py-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Showing {posts.length} posts, newest first</div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Avatar>
                  <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.userName}</div>
                  <div className="text-xs text-muted-foreground">
                    {post.timestamp ? new Date(post.timestamp).toLocaleString() : "Unknown time"}
                  </div>
                </div>
              </div>
              <CardTitle className="text-lg">{post.content}</CardTitle>
              <CardDescription>Post ID: {post.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">Post Content</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Comments</span>
              </div>
              <div className="text-xs text-muted-foreground">User ID: {post.userid}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

