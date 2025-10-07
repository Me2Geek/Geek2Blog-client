"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Moon, Sun, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";

interface Post {
  id: number
  title: string
  content: string
  date: string
  avatar?: string
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
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
    if (post?.title) {
      document.title = `${siteName} - ${post.title}`
    } else {
      document.title = siteName
    }
  }, [post?.title, siteName])

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(params.id) }),
      })
      const data = await response.json()
      if (data.status) {
        // 添加延迟以展示加载动画
        await new Promise(resolve => setTimeout(resolve, 600))
        const foundPost = data.data.find((p: Post) => p.id === Number(params.id))
        setPost(foundPost || null)
      }
    } catch (error) {
      console.error("Failed to fetch post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 骨架屏组件
  const SkeletonContent = () => (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" className="flex items-center gap-2 animate-pulse">
            <div className="h-4 w-4 bg-muted rounded"></div>
            <div className="h-4 w-12 bg-muted rounded"></div>
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 bg-muted rounded animate-pulse hidden md:inline"></div>
            <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="h-8 bg-muted rounded-md mb-3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-md w-32 animate-pulse"></div>
          </div>
        </div>

        <Card className="p-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          </div>
        </Card>
      </main>
    </div>
  )

  if (isLoading) {
    return <SkeletonContent />
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground animate-pulse">文章未找到</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 hover:bg-accent/50 transition-all duration-200 hover:scale-105">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            返回
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">{siteName}</span>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="hover:scale-110 transition-transform duration-200">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6 animate-in duration-500">
          <div>
            <h1 className="text-3xl font-bold text-foregroundduration-700">{post.title}</h1>
            <time className="text-sm text-muted-foreground duration-700">{post.date}</time>
          </div>
        </div>

          <Card className="p-8 duration-700 hover:shadow-lg transition-shadow">
              <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                      {post.content}
                  </ReactMarkdown>
              </div>
          </Card>

      </main>
    </div>
  )
}
