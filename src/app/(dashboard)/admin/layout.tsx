// app/(dashboard)/admin/layout.tsx

import React from 'react';
import { auth } from "@/app/auth"; // auth objesini import ediyoruz
import { redirect } from 'next/navigation'; // Yönlendirme için

// Admin paneline özel bir sidebar veya üst menü ekleyebiliriz.
// Bu örnekte sadece basit bir wrapper oluşturacağız.

export default async function AdminLayout({
  children, // Bu prop, altındaki page.tsx veya alt layout'ları temsil eder
}: {
  children: React.ReactNode;
}) {
  // Bu layout bir Server Component olduğu için async olabilir
  // ve oturum bilgisini doğrudan çekebiliriz.
  const session = await auth();

  // Yetkilendirme kontrolü: Sadece ADMIN rolüne sahip kullanıcılar erişebilir.
  // Bu kontrolü middleware zaten yapıyor olsa da, "defense in depth" için
  // burada tekrar yapmak iyi bir pratiktir.
  if (!session || session.user.role !== "ADMIN") {
    // Eğer kullanıcı giriş yapmamışsa veya admin değilse, giriş sayfasına yönlendir.
    // Veya özel bir "Yetkiniz Yok" sayfasına yönlendirebilirsiniz.
    redirect("/giris");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* İsteğe bağlı: Admin Sidebar buraya gelebilir */}
      {/* <aside className="w-64 bg-white dark:bg-gray-900 p-4 shadow-md">
        <nav>
          <ul className="space-y-2">
            <li><Link href="/admin/users">Kullanıcılar</Link></li>
            <li><Link href="/admin/mangas">Mangalar</Link></li>
          </ul>
        </nav>
      </aside> */}

      <main className="flex-1 p-4 md:p-8">
        {children} {/* admin/page.tsx veya diğer admin alt sayfaları burada render edilecek */}
      </main>
    </div>
  );
}

// Opsiyonel: Metadata buraya eklenebilir
export const metadata = {
  title: 'Admin Paneli',
  description: 'Yönetim paneli',
};