// app/(dashboard)/admin/page.tsx
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { Users, UserPlus, BookOpen, Activity } from "lucide-react";
import { Suspense } from "react";

// Separate component for async data fetching
async function DashboardStats() {
  const [userCount, todayUsers, weeklyUsers, mangaCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { 
        createdAt: { 
          gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        } 
      },
    }),
    prisma.user.count({
      where: { 
        createdAt: { 
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        } 
      },
    }),
    prisma.manga?.count() || 0,
  ]);

  const yesterdayUsers = await prisma.user.count({
    where: { 
      createdAt: { 
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lt: new Date(new Date().setHours(0, 0, 0, 0))
      } 
    },
  });

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard 
        title="Toplam Üye" 
        value={userCount}
        icon={Users}
        subtitle="Kayıtlı kullanıcı sayısı"
        accent="default"
      />
      
      <SummaryCard 
        title="Bugün Kayıt" 
        value={todayUsers}
        icon={UserPlus}
        subtitle="Son 24 saatte"
        accent="success"
        trend={todayUsers > yesterdayUsers ? "up" : todayUsers < yesterdayUsers ? "down" : "neutral"}
      />
      
      <SummaryCard 
        title="Haftalık Kayıt" 
        value={weeklyUsers}
        icon={Activity}
        subtitle="Son 7 günde"
        accent="info"
      />
      
      <SummaryCard 
        title="Manga Sayısı" 
        value={mangaCount || "Yakında"}
        icon={BookOpen}
        subtitle="Toplam manga"
        accent="default"
      />
    </div>
  );
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SummaryCard 
          key={i}
          title="" 
          value="" 
          loading={true}
        />
      ))}
    </div>
  );
}

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/giris");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Sistemin genel durumunu ve istatistikleri görüntüleyin.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Add more sections as needed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Son Aktiviteler</h3>
          <p className="text-muted-foreground text-sm">
            Aktivite izleme yakında eklenecek...
          </p>
        </div>
        
        <div className="rounded-xl bg-card border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
          <p className="text-muted-foreground text-sm">
            Hızlı işlem paneli yakında eklenecek...
          </p>
        </div>
      </div>
    </div>
  );
}
