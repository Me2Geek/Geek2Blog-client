import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"

const posts = {
  "1": {
    id: 1,
    title: "demo1",
    content: `# demo1

## 简介

简单介绍博客

## 特点

- 支持Markdown格式
- 支持主题切换
- 响应式设计

    `,
    date: "2025-10-4",
    avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=3054086606&spec=640&img_type=jpg",
  },
  "2": {
    id: 2,
    title: "demo2",
    content: `# demo2

## 简介

展示博客系统的基本功能

## 功能

- 文章列表展示
- 文章详情页面
- 暗色/亮色主题切换

## 后续计划

对接后端API
    `,
    date: "2025-10-4",
    avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=493941191&spec=640&img_type=jpg",
  },
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = posts[id as keyof typeof posts]

  if (!post) {
    return <div>文章不存在</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between max-w-4xl">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <article>
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={post.avatar || "/placeholder.svg"}
              alt="作者头像"
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{post.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <time>{post.date}</time>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
                  ),
                  h3: ({ children }) => <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground leading-relaxed mb-1">{children}</li>,
                  code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
