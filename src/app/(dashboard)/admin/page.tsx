// app/(dashboard)/admin/page.tsx
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // Doğru Prisma Client import yolunu kullanıyoruz

// YENİ: UserListTable komponentini import ediyoruz
import { UserListTable } from "@/components/admin/UserListTable";

// Bu bir Server Component
export default async function AdminPage() {
    const session = await auth();
    // Middleware yetkilendirme kontrolünü halletse de, ek bir güvenlik katmanı
    if (session?.user.role !== "ADMIN") {
        redirect("/giris");
    }

    // Kullanıcıları veritabanından çekiyoruz
    // createdAt hatası düzeldiğinden emin olalım (geçmiş cevaplardaki çözüm)
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>
            <p className="mb-6">Hoş geldin, {session.user.name || "Admin"}!</p>
            
            {/* Burası DİKKAT!
                Tüm "Kullanıcılar" tablosu kısmını UserListTable komponentine taşıyoruz
                ve 'users' verisini prop olarak gönderiyoruz.
            */}
            <UserListTable users={users} />
        </div>
    );
}