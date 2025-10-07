"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import Link from "next/link"

interface Post {
  id: number
  title: string
  content: string
  date: string
  avatar?: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isDark, setIsDark] = useState(true)
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "我的博客"

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0 }),
      })
      const data = await response.json()
      if (data.status) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  const getPreview = (content: string) => {
    return content.length > 50 ? content.substring(0, 50) + "..." : content
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{siteName}</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/login">
              <Button variant="ghost">登录</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-14 max-w-4xl">
        <div className="space-y-12">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block">
              <Card className="p-7 md:p-9 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-5 md:gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-[22px] font-semibold text-foreground mb-3">{post.title}</h2>
                    <time className="text-sm text-muted-foreground">{post.date}</time>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
