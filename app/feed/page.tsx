import FeedContent from "@/components/feed-content"

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Feed</h1>
      <p className="text-muted-foreground">Real-time posts with newest at the top</p>
      <FeedContent />
    </div>
  )
}

