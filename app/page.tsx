import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

const posts = [
  {
    id: 1,
    title: "demo1",
    excerpt: "这是第一篇示例文章的摘要内容",
    date: "2025-10-4",
    avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=3054086606&spec=640&img_type=jpg",
  },
  {
    id: 2,
    title: "demo2",
    excerpt: "这是第二篇示例文章的摘要内容",
    date: "2025-10-4",
    avatar: "http://q.qlogo.cn/headimg_dl?dst_uin=493941191&spec=640&img_type=jpg",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground">我的博客</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block group">
              <article className="bg-card rounded-lg p-6 border border-border hover:border-foreground/20 transition-colors">
                <div className="flex items-start gap-4">
                  <Image
                    src={post.avatar || "/placeholder.svg"}
                    alt="作者头像"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-muted-foreground transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-3 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <time>{post.date}</time>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
