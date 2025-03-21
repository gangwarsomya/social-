import TrendingPostsContent from "@/components/trending-posts-content"

export default function TrendingPostsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trending Posts</h1>
      <p className="text-muted-foreground">Posts with the maximum number of comments</p>
      <TrendingPostsContent />
    </div>
  )
}

