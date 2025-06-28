// Navbar.tsx

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
// Değişiklik: useSession ve signOut hook'larını next-auth/react'ten import ediyoruz.
import { useSession, signOut } from "next-auth/react" 
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator // Ayırıcı çizgi için
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings } from "lucide-react" // Yeni ikonlar ekledik
import { Skeleton } from "@/components/ui/skeleton" // Yüklenme efekti için Skeleton

export default function Navbar() {
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // Değişiklik: Auth.js'den session (oturum) verisini ve durumunu alıyoruz.
  const { data: session, status } = useSession()

  // Helper fonksiyonu
  const closeMobileMenu = () => setMobileOpen(false)

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-pixelify">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* ... Logo ve diğer linkler aynı kalıyor ... */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-16" style={{ aspectRatio: 717 / 442 }}>
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
          </Link>
          <div className="hidden sm:flex sm:space-x-8 sm:items-center">
            {/* ... Diğer menu linkleri ... */}
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Anasayfa</Link>
            <Link href="/changelog" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Değişiklikler</Link>
            <Link href="/mangalar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Mangalar</Link>
            {/* Diğer Dropdownlar buraya... */}
          </div>
          {/* Right side */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <input type="text" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* ====== YENİ DİNAMİK GİRİŞ / PROFİL KISMI (DESKTOP) ====== */}
            <div className="hidden sm:block">
              {status === "loading" && (
                // Oturum bilgisi yüklenirken bir iskelet göster
                <Skeleton className="h-8 w-20" />
              )}
              
              {status === "unauthenticated" && (
                // Kullanıcı giriş yapmamışsa "Giriş Yap" butonunu göster
                <Link href="/giris">
                  <Button variant="outline" size="sm">
                    Giriş Yap
                  </Button>
                </Link>
              )}

              {status === "authenticated" && session.user && (
                // Kullanıcı giriş yapmışsa profil resmini ve dropdown'ı göster
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus:outline-none rounded-full">
                       <Image
                        src={session.user.image || '/default-avatar.png'} // Varsa kullanıcının resmi, yoksa varsayılan resim
                        alt={session.user.name || "Kullanıcı"}
                        width={32}
                        height={32}
                        className="rounded-full"
                       />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-pixelify bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mr-4">
                    <DropdownMenuItem asChild>
                      <Link href="/profilim" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profilim</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link href="/ayarlar" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Ayarlar</span>
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-500 dark:text-red-400 focus:text-red-600 dark:focus:text-red-500 flex items-center cursor-pointer">
                       <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
             {/* ====== BİTİŞ ====== */}
            
            <ThemeToggle />

            {/* Mobile Menu Toggle Butonu */}
            <button
              className="sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
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
          <div className="font-pixelify px-2 pt-2 pb-3 space-y-1">
            {/* ... Diğer mobil linkler ... */}

             {/* ====== YENİ DİNAMİK GİRİŞ / PROFİL KISMI (MOBİL) ====== */}
             <div className="px-3 py-2">
               {status === "loading" && <Skeleton className="h-8 w-full" />}
               {status === "unauthenticated" && (
                 <Link href="/giris" onClick={closeMobileMenu}>
                   <Button variant="outline" className="w-full">Giriş Yap</Button>
                 </Link>
               )}
               {status === "authenticated" && session.user && (
                 <div className="flex flex-col space-y-2">
                    <Link href="/profilim" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center">
                        <User className="mr-2 h-4 w-4" /> Profilim
                    </Link>
                     <Link href="/ayarlar" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center">
                        <Settings className="mr-2 h-4 w-4" /> Ayarlar
                    </Link>
                    <button onClick={() => { signOut(); closeMobileMenu(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center">
                       <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                    </button>
                 </div>
               )}
            </div>
             {/* ====== BİTİŞ ====== */}

          </div>
        </div>
      )}
    </nav>
  )
}