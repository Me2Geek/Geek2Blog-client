"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"

export default function AnimationDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const triggerLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 animate-in slide-in-from-top-4 fade-in-0 duration-700">
          动画效果演示
        </h2>
        <p className="text-muted-foreground animate-in slide-in-from-bottom-4 fade-in-0 duration-700 delay-200">
          展示博客中使用的各种动画效果
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 加载动画演示 */}
        <Card className="p-6 animate-in slide-in-from-left-4 fade-in-0 duration-700 delay-300">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h3 className="font-semibold">加载动画</h3>
            <p className="text-sm text-muted-foreground text-center">
              旋转的加载图标，用于数据获取时显示
            </p>
          </div>
        </Card>

        {/* 悬停效果演示 */}
        <Card className="p-6 animate-in slide-in-from-bottom-4 fade-in-0 duration-700 delay-400 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">悬停效果</h3>
            <p className="text-sm text-muted-foreground text-center">
              鼠标悬停时的缩放和阴影效果
            </p>
          </div>
        </Card>

        {/* 按钮动画演示 */}
        <Card className="p-6 animate-in slide-in-from-right-4 fade-in-0 duration-700 delay-500">
          <div className="flex flex-col items-center space-y-4">
            <Button 
              onClick={triggerLoading}
              disabled={isLoading}
              className="hover:scale-105 transition-transform duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                "点击测试"
              )}
            </Button>
            <h3 className="font-semibold">按钮动画</h3>
            <p className="text-sm text-muted-foreground text-center">
              按钮的缩放和状态变化动画
            </p>
          </div>
        </Card>
      </div>

      {/* 骨架屏演示 */}
      <Card className="p-6 animate-in slide-in-from-bottom-4 fade-in-0 duration-700 delay-600">
        <h3 className="font-semibold mb-4">骨架屏动画</h3>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
        </div>
      </Card>
    </div>
  )
}
