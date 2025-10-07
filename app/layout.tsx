import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || '我的博客',
  description: 'geek2blog',
  generator: 'Me2Geek',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        {/* 全局悬浮搜索 */}
        <div suppressHydrationWarning>
          {/* 仅在客户端渲染浮层 */}
          {typeof window !== 'undefined' && require('../components/ui/floating-search') && require('../components/ui/floating-search').FloatingSearch && (
            require('../components/ui/floating-search').FloatingSearch()
          )}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
