"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface Post {
  id: number
  title: string
  content: string
  date: string
  avatar?: string
}

export default function SearchPage() {
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Post[]>([])

  const canSearch = useMemo(() => keyword.trim().length > 0 && keyword.trim().length <= 20, [keyword])

  const onSearch = useCallback(async () => {
    const q = keyword.trim()
    if (!q) return
    if (q.length > 20) {
      setError("搜索关键字过长")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: q }),
      })
      const data = await res.json()
      if (!data.status) {
        setResults([])
        setError(data.message || "没有搜索结果")
        return
      }
      setResults(data.data || [])
    } catch (e) {
      setError("搜索失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }, [keyword])

  useEffect(() => {
    const controller = new AbortController()
    return () => controller.abort()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">搜索文章</h1>
          <Link href="/">
            <Button variant="ghost">返回首页</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex gap-3">
          <Input
            placeholder="输入关键词（最长20个字符）"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch()
            }}
            aria-invalid={!canSearch && keyword.length > 0}
          />
          <Button onClick={onSearch} disabled={!canSearch || loading}>
            {loading ? "搜索中..." : "搜索"}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-destructive mt-3">{error}</p>
        )}

        <div className="mt-6 space-y-4">
          {results.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <h2 className="text-lg font-semibold text-foreground mb-1">{post.title}</h2>
                <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                <time className="text-xs text-muted-foreground">{post.date}</time>
              </Card>
            </Link>
          ))}
          {!loading && !error && results.length === 0 && (
            <p className="text-muted-foreground">请输入关键词进行搜索</p>
          )}
        </div>
      </main>
    </div>
  )
}


