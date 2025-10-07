"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Loader2 } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/Footer";

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
  const [isLoading, setIsLoading] = useState(true)
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
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0 }),
      })
      const data = await response.json()
      if (data.status) {
        // 添加延迟以展示加载动画
        await new Promise(resolve => setTimeout(resolve, 800))
        setPosts(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPreview = (content: string) => {
    return content.length > 50 ? content.substring(0, 50) + "..." : content
  }

  // 骨架屏组件
  const SkeletonCard = () => (
    <Card className="p-7 md:p-9 animate-pulse">
      <div className="flex items-start gap-5 md:gap-6">
        <div className="flex-1">
          <div className="h-6 bg-muted rounded-md mb-3 animate-pulse"></div>
          <div className="h-4 bg-muted rounded-md w-24 animate-pulse"></div>
        </div>
      </div>
    </Card>
  )

  // 加载状态组件
  const LoadingState = () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
      <p className="text-muted-foreground animate-pulse">正在加载文章列表...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground animate-in slide-in-from-top-4 fade-in-0 duration-700">{siteName}</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="hover:scale-110 transition-transform duration-200">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
              <Link href="/search">
                  <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">搜索</Button>
              </Link>
              <Link href="/login">
                  <Button variant="ghost" className="hover:scale-105 transition-transform duration-200">登录</Button>
              </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-14 max-w-4xl">
        {isLoading ? (
          <div className="space-y-12">
            {Array.from({ length: 2 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/post/${post.id}`} className="block">
                <Card className="p-7 md:p-9 hover:bg-accent/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg">
                  <div className="flex items-start gap-5 md:gap-6">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-[22px] font-semibold text-foreground mb-3 transition-colors group-hover:text-primary">{post.title}</h2>
                      <time className="text-sm text-muted-foreground">{post.date}</time>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
        <Footer />
    </div>
  )
}
