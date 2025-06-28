// app/(dashboard)/admin/page.tsx
import { auth } from "@/app/auth"; // Merkezi auth.ts dosyamız
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // Prisma client'ını import ettiğin yol

// Bu bir Server Component, bu yüzden async olabilir
export default async function AdminPage() {
    // Burada tekrar rol kontrolü yapmak, "defense in depth" (katmanlı savunma) için iyidir.
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
        redirect("/giris"); // Veya bir "Yetkiniz Yok" sayfasına yönlendir.
    }

    // Örnek veri: Tüm kullanıcıları çekelim
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        }
    });

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>
            <p className="mb-6">Hoş geldin, {session.user.name || "Admin"}!</p>
            
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Kullanıcılar</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b dark:border-gray-600">
                            <tr>
                                <th className="p-2">İsim</th>
                                <th className="p-2">E-posta</th>
                                <th className="p-2">Rol</th>
                                <th className="p-2">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}