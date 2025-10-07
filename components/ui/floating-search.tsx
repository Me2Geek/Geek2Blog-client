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
}

export function FloatingSearch() {
  const [open, setOpen] = useState(false)
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
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!open) {
    return (
      <button
        aria-label="打开搜索 (Ctrl/⌘+K)"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        🔍
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 dark:bg-black/60">
      <div className="w-full max-w-2xl rounded-lg bg-background border border-border shadow-xl">
        <div className="p-4 border-b border-border flex gap-2">
          <Input
            autoFocus
            placeholder="输入关键词（最长20个字符），Enter 搜索"
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
          <Button variant="ghost" onClick={() => setOpen(false)}>关闭</Button>
        </div>
        {error && <p className="px-4 pt-3 text-sm text-destructive">{error}</p>}
        <div className="p-4 max-h[60vh] max-h-[60vh] overflow-auto space-y-3">
          {results.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} onClick={() => setOpen(false)}>
              <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <h3 className="text-base font-semibold text-foreground mb-1">{post.title}</h3>
                <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                <time className="text-xs text-muted-foreground">{post.date}</time>
              </Card>
            </Link>
          ))}
          {!loading && !error && results.length === 0 && (
            <p className="text-muted-foreground">输入关键词并回车开始搜索</p>
          )}
        </div>
        <div className="px-4 pb-4 text-xs text-muted-foreground">按 Esc 关闭 · Ctrl/⌘+K 打开</div>
      </div>
    </div>
  )
}


