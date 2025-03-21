"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, TrendingUp, Activity } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Top Users", href: "/top-users", icon: <BarChart2 className="h-5 w-5" /> },
    { name: "Trending Posts", href: "/trending-posts", icon: <TrendingUp className="h-5 w-5" /> },
    { name: "Feed", href: "/feed", icon: <Activity className="h-5 w-5" /> },
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0 font-bold text-xl">Social Media Analytics</div>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

