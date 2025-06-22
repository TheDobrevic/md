"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, X } from "lucide-react"

export default function Navbar() {
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-16" style={{ aspectRatio: 717 / 442 }}>
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex sm:space-x-8 sm:items-center">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Anasayfa
            </Link>
            <Link href="/mangalar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Mangalar
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Başvuru <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/basvuru/cevirmen-olurum">Nasıl Çevirmen Olurum</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/basvuru/editor-olurum">Nasıl Editör Olurum</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  Bilgilendirme <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/sss">Sıkça Sorulan Sorular</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/cevirmen-kilavuzu">Çevirmen Kılavuzu</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/imla-yazim-kilavuzu">İmla Yazım Kılavuzu</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/gizlilik-sozlesmesi">Gizlilik Sözleşmesi</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search (desktop) */}
            <div className="hidden sm:block">
              <input
                type="text"
                placeholder="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Login Button (desktop) */}
            <div className="hidden sm:block">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Giriş Yap
                </Button>
              </Link>
            </div>
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Anasayfa
            </Link>
            <Link href="/mangalar" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Mangalar
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  Başvuru <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/basvuru/cevirmen-olurum">Nasıl Çevirmen Olurum</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/basvuru/editor-olurum">Nasıl Editör Olurum</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  Bilgilendirme <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/sss">Sıkça Sorulan Sorular</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/cevirmen-kilavuzu">Çevirmen Kılavuzu</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/imla-yazim-kilavuzu">İmla Yazım Kılavuzu</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bilgilendirme/gizlilik-sozlesmesi">Gizlilik Sözleşmesi</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Giriş Yap
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
