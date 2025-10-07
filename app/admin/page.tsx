"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus, LogOut, Moon, Sun, Home } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Post {
  id: number
  title: string
  content: string
  date: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({ title: "", content: "", date: "" })
  const [isDark, setIsDark] = useState(true)
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initAdmin = async () => {
      try {
        console.log("Initializing admin page")
        const storedToken = localStorage.getItem("token")

        if (!storedToken) {
          console.log("No token found, redirecting to login")
          router.push("/login")
          return
        }

        console.log("Token found, setting token")
        setToken(storedToken)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        console.log("API URL:", apiUrl)

        await fetchPosts(apiUrl)
      } catch (error) {
        console.error("Admin initialization error:", error)
        toast({
          title: "初始化失败",
          description: "无法加载数据，请检查后端服务是否运行",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initAdmin()
  }, [router, toast])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const fetchPosts = async (apiUrl?: string) => {
    const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    console.log("Fetching posts from:", `${baseUrl}/post/get`)

    try {
      const response = await fetch(`${baseUrl}/post/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0 }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (data.status) {
        setPosts(data.data)
        console.log("Posts loaded successfully:", data.data.length)
      } else {
        console.error("API returned error:", data.message)
        toast({
          title: "加载失败",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      toast({
        title: "加载失败",
        description: error instanceof Error ? error.message : "网络错误",
        variant: "destructive",
      })
    }
  }

  const handleAdd = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    try {
      const response = await fetch(`${apiUrl}/post/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          post: { ...formData, id: 0 },
        }),
      })
      const data = await response.json()

      if (data.status) {
        toast({ title: "添加成功", description: data.message })
        fetchPosts()
        setIsDialogOpen(false)
        setFormData({ title: "", content: "", date: "" })
      } else {
        toast({ title: "添加失败", description: data.message, variant: "destructive" })
      }
    } catch (error) {
      console.error("Add post error:", error)
      toast({ title: "添加失败", description: "网络错误", variant: "destructive" })
    }
  }

  const handleUpdate = async () => {
    if (!editingPost) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    try {
      const response = await fetch(`${apiUrl}/post/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          post: { ...formData, id: editingPost.id },
        }),
      })
      const data = await response.json()

      if (data.status) {
        toast({ title: "更新成功", description: data.message })
        fetchPosts()
        setIsDialogOpen(false)
        setEditingPost(null)
        setFormData({ title: "", content: "", date: "" })
      } else {
        toast({ title: "更新失败", description: data.message, variant: "destructive" })
      }
    } catch (error) {
      console.error("Update post error:", error)
      toast({ title: "更新失败", description: "网络错误", variant: "destructive" })
    }
  }

  const handleDelete = async (post: Post) => {
    if (!confirm(`确定要删除文章 "${post.title}" 吗？`)) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    try {
      const response = await fetch(`${apiUrl}/post/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          post: { id: post.id },
        }),
      })
      const data = await response.json()

      if (data.status) {
        toast({ title: "删除成功", description: data.message })
        fetchPosts()
      } else {
        toast({ title: "删除失败", description: data.message, variant: "destructive" })
      }
    } catch (error) {
      console.error("Delete post error:", error)
      toast({ title: "删除失败", description: "网络错误", variant: "destructive" })
    }
  }

  const openAddDialog = () => {
    setEditingPost(null)
    setFormData({ title: "", content: "", date: new Date().toISOString().split("T")[0] })
    setIsDialogOpen(true)
  }

  const openEditDialog = (post: Post) => {
    setEditingPost(post)
    setFormData({ title: post.title, content: post.content, date: post.date })
    setIsDialogOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const insertAtCursor = (text: string) => {
    const el = contentRef.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const before = formData.content.slice(0, start)
    const after = formData.content.slice(end)
    const next = `${before}${text}${after}`
    setFormData((prev) => ({ ...prev, content: next }))
    requestAnimationFrame(() => {
      if (!el) return
      const caret = start + text.length
      el.selectionStart = el.selectionEnd = caret
      el.focus()
    })
  }

  const uploadImage = async (file: File) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const form = new FormData()
    form.append("token", token)
    form.append("file", file)
    const res = await fetch(`${apiUrl}/post/uploadImage`, {
      method: "POST",
      body: form,
    })
    const data = await res.json()
    if (!data.status) throw new Error(data.message || "上传失败")
    const path: string = data.data
    const full = path.startsWith("http") ? path : `${apiUrl}${path}`
    return full
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items
    if (!items) return
    const files: File[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === "file") {
        const f = item.getAsFile()
        if (f) files.push(f)
      }
    }
    if (files.length === 0) return
    e.preventDefault()
    try {
      for (const f of files) {
        const url = await uploadImage(f)
        insertAtCursor(`\n![image](${url})\n`)
      }
      toast({ title: "上传成功", description: `已插入 ${files.length} 张图片` })
    } catch (err) {
      toast({ title: "上传失败", description: err instanceof Error ? err.message : "出错了", variant: "destructive" })
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    const fileList = e.dataTransfer?.files
    if (!fileList || fileList.length === 0) return
    e.preventDefault()
    try {
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i]
        const url = await uploadImage(f)
        insertAtCursor(`\n![image](${url})\n`)
      }
      toast({ title: "上传成功", description: `已插入 ${fileList.length} 张图片` })
    } catch (err) {
      toast({ title: "上传失败", description: err instanceof Error ? err.message : "出错了", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">管理后台</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}> 
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  新建文章
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingPost ? "编辑文章" : "新建文章"}</DialogTitle>
                  <DialogDescription>{editingPost ? "修改文章内容" : "填写文章信息"}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="请输入标题"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">内容</Label>
                    <Textarea
                      id="content"
                      ref={contentRef}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      onPaste={handlePaste}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      placeholder="支持 Markdown。可粘贴或拖拽图片自动上传"
                      rows={14}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">日期</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <Button onClick={editingPost ? handleUpdate : handleAdd} className="w-full">
                    {editingPost ? "更新" : "添加"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              退出
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{post.title}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">{post.date}</p>
                <p className="text-foreground line-clamp-3">{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
