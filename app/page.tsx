"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
          <h1 className="text-2xl font-bold text-foreground">我的博客</h1>
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.avatar || "/placeholder.svg?height=48&width=48"} />
                    <AvatarFallback>{post.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground mb-2">{post.title}</h2>
                    <p className="text-muted-foreground mb-3">{getPreview(post.content)}</p>
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
