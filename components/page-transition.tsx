"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isAnimating 
          ? 'opacity-0 translate-x-4' 
          : 'opacity-100 translate-x-0'
      }`}
    >
      {children}
    </div>
  )
}
