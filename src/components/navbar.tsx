// Navbar.tsx

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react" 
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
// Gerekli yeni ikonları ekledim:
import { Menu, X, User, LogOut, Settings, ChevronDown, BookOpen, PenSquare } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Navbar() {
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session, status } = useSession()
  const closeMobileMenu = () => setMobileOpen(false)

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-pixelify">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-16" style={{ aspectRatio: 717 / 442 }}>
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
          </Link>
          
          {/* Masaüstü Navigasyon Linkleri */}
          <div className="hidden sm:flex sm:space-x-4 sm:items-center"> {/* space-x-4'e düşürdüm sığması için */}
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Anasayfa</Link>
            <Link href="/changelog" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Değişiklikler</Link>
            <Link href="/mangalar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Mangalar</Link>

            {/* === YENİDEN EKLENEN "BAŞVURU" MENÜSÜ === */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none">
                <span>Başvuru</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-pixelify bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DropdownMenuItem asChild>
                  <Link href="/nasil-cevirmen-olurum" className="flex items-center cursor-pointer"><PenSquare className="mr-2 h-4 w-4"/>Nasıl Çevirmen Olurum</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/nasil-editor-olurum" className="flex items-center cursor-pointer"><PenSquare className="mr-2 h-4 w-4"/>Nasıl Editör Olurum</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* === YENİDEN EKLENEN "BİLGİLENDİRME" MENÜSÜ === */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none">
                <span>Bilgilendirme</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-pixelify bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DropdownMenuItem asChild>
                  <Link href="/cevirmen-kilavuzu" className="flex items-center cursor-pointer"><BookOpen className="mr-2 h-4 w-4"/>Çevirmen Kılavuzu</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Sağ Taraf (Arama, Auth, Tema, vb.) */}
          <div className="flex items-center space-x-4">
            {/* ... Diğer öğeler aynı ... */}
             <div className="hidden sm:block">
               <input type="text" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="hidden sm:block">
              {status === "loading" && <Skeleton className="h-8 w-20" />}
              {status === "unauthenticated" && ( <Link href="/giris"><Button variant="outline" size="sm">Giriş Yap</Button></Link> )}
              {status === "authenticated" && session.user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus:outline-none rounded-full"><Image src={session.user.image || '/default-avatar.png'} alt={session.user.name || "Kullanıcı"} width={32} height={32} className="rounded-full"/></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-pixelify bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mr-4">
                    <DropdownMenuItem asChild><Link href="/profilim" className="flex items-center cursor-pointer"><User className="mr-2 h-4 w-4"/>Profilim</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/ayarlar" className="flex items-center cursor-pointer"><Settings className="mr-2 h-4 w-4"/>Ayarlar</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-500 dark:text-red-400 focus:text-red-600 dark:focus:text-red-500 flex items-center cursor-pointer"><LogOut className="mr-2 h-4 w-4"/>Çıkış Yap</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
             <ThemeToggle />
             <button className="sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      {mobileOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="font-pixelify px-2 pt-2 pb-3 space-y-1">
            {/* Normal Linkler */}
            <Link href="/" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Anasayfa</Link>
            <Link href="/changelog" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Değişiklikler</Link>
            <Link href="/mangalar" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Mangalar</Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Başvuru Linkleri */}
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Başvuru</div>
            <Link href="/nasil-cevirmen-olurum" onClick={closeMobileMenu} className="block pl-5 pr-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Nasıl Çevirmen Olurum</Link>
            <Link href="/nasil-editor-olurum" onClick={closeMobileMenu} className="block pl-5 pr-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Nasıl Editör Olurum</Link>

            {/* Bilgilendirme Linkleri */}
             <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Bilgilendirme</div>
            <Link href="/cevirmen-kilavuzu" onClick={closeMobileMenu} className="block pl-5 pr-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Çevirmen Kılavuzu</Link>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            {/* Giriş / Profil Kısmı (Mobil) */}
             <div className="px-3 py-2">
               {status === "loading" && <Skeleton className="h-8 w-full" />}
               {status === "unauthenticated" && (<Link href="/giris" onClick={closeMobileMenu}><Button variant="outline" className="w-full">Giriş Yap</Button></Link>)}
               {status === "authenticated" && session.user && (
                 <div className="flex flex-col space-y-2">
                    <Link href="/profilim" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center"><User className="mr-2 h-4 w-4"/> Profilim</Link>
                    <Link href="/ayarlar" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center"><Settings className="mr-2 h-4 w-4"/> Ayarlar</Link>
                    <button onClick={() => { signOut(); closeMobileMenu(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"><LogOut className="mr-2 h-4 w-4"/> Çıkış Yap</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}