// app/(dashboard)/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { UserListTable } from "@/components/admin/UserListTable";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function UsersData() {
  const users = await prisma.user.findMany({ 
    orderBy: { createdAt: "desc" },
    take: 100 // Limit initial load for performance
  });

  return <UserListTable users={users} />;
}

function UsersLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-muted rounded animate-pulse"></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
      ))}
    </div>
  );
}

export default async function UsersPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/giris");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Üyeler</h1>
        <p className="text-muted-foreground mt-2">
          Kayıtlı kullanıcıları yönetin ve görüntüleyin.
        </p>
      </div>
      
      <Suspense fallback={<UsersLoading />}>
        <UsersData />
      </Suspense>
    </div>
  );
}
