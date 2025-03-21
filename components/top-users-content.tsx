"use client"

import { useState, useEffect } from "react"
import { fetchUsers, fetchPosts, type User, type Post } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function TopUsersContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topUsers, setTopUsers] = useState<{ user: User; postCount: number }[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setRefreshing(true)

      // First, check if authentication is working
      const authResponse = await fetch("/api/auth")
      if (!authResponse.ok) {
        throw new Error("Authentication failed. Please check your credentials.")
      }

      // Fetch users and posts in parallel
      const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()])

      // Count posts per user
      const userPostCounts = new Map<string, number>()

      posts.forEach((post: Post) => {
        const userId = post.userid.toString()
        userPostCounts.set(userId, (userPostCounts.get(userId) || 0) + 1)
      })

      // Create array of users with post counts
      const usersWithCounts = users.map((user) => ({
        user,
        postCount: userPostCounts.get(user.id) || 0,
      }))

      // Sort by post count (descending) and take top 5
      const sortedTopUsers = usersWithCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5)

      setTopUsers(sortedTopUsers)
      setError(null)
      setLoading(false)
    } catch (err) {
      setError("Failed to load user data. Please try again later.")
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
    return <div className="flex justify-center p-8">Loading top users...</div>
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
    <div className="space-y-8">
      <div className="flex justify-end">
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

      <div className="grid gap-4 md:grid-cols-5">
        {topUsers.map(({ user, postCount }, index) => (
          <Card key={user.id} className={index === 0 ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{index === 0 ? "🏆 Top User" : `#${index + 1}`}</CardTitle>
              <div className="text-xl font-bold">{postCount}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">User ID: {user.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {topUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Post Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topUsers.map((item) => ({ name: item.user.name, posts: item.postCount }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="posts" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

