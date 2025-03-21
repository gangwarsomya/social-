import { redirect } from "next/navigation"

export default function Home() {
  redirect("/top-users")
  return null
}

