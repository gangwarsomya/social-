import TopUsersContent from "@/components/top-users-content"

export default function TopUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Top Users</h1>
      <p className="text-muted-foreground">Users with the highest number of posts</p>
      <TopUsersContent />
    </div>
  )
}

