"use client"

import { useState, useEffect } from "react"
import { fetchPosts, fetchComments, fetchUsers, type Post, type User } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostWithCommentCount extends Post {
  commentCount: number
  userName: string
}

export default function TrendingPostsContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendingPosts, setTrendingPosts] = useState<PostWithCommentCount[]>([])
  const [maxCommentCount, setMaxCommentCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setRefreshing(true)

      // Fetch posts and users
      const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()])

      // Create a map of user IDs to names for quick lookup
      const userMap = new Map<string, string>()
      users.forEach((user: User) => {
        userMap.set(user.id, user.name)
      })

      // Fetch comment counts for each post
      const postsWithCommentPromises = posts.map(async (post: Post) => {
        try {
          const comments = await fetchComments(post.id)
          return {
            ...post,
            commentCount: comments.length,
            userName: userMap.get(post.userid.toString()) || "Unknown User",
          }
        } catch (error) {
          // If we can't fetch comments for a specific post, assume 0 comments
          console.error(`Error fetching comments for post ${post.id}:`, error)
          return {
            ...post,
            commentCount: 0,
            userName: userMap.get(post.userid.toString()) || "Unknown User",
          }
        }
      })

      const postsWithComments = await Promise.all(postsWithCommentPromises)

      // Find the maximum comment count
      const maxCount = Math.max(...postsWithComments.map((post) => post.commentCount), 0)
      setMaxCommentCount(maxCount)

      // Filter posts with the maximum comment count
      const trending = postsWithComments.filter((post) => post.commentCount === maxCount)

      setTrendingPosts(trending)
      setLoading(false)
    } catch (err) {
      setError("Failed to load trending posts. Please try again later.")
      console.error(err)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = () => {
    loadData()
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading trending posts...</div>
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

  if (trendingPosts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p>No trending posts found</p>
        <Button onClick={handleRefresh} className="mt-4">
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-medium">Posts with {maxCommentCount} comments - the highest in the platform</p>
        </div>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trendingPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3 mb-2">
                <Avatar>
                  <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.userName}</div>
                  <div className="text-xs text-muted-foreground">User ID: {post.userid}</div>
                </div>
              </div>
              <CardTitle className="text-lg">{post.content}</CardTitle>
              <CardDescription>Post ID: {post.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">Post Content Preview</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{post.commentCount} comments</span>
              </div>
              <div className="text-xs text-muted-foreground">Trending</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

