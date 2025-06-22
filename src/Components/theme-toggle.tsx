// components/ThemeToggle.tsx
"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react" // Eğer ikon istiyorsan bunu kurmalısın

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-black" />}
    </button>
  )
}
