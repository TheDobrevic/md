/* ----------------------------------------------------------------
   app/(dashboard)/admin/page.tsx
----------------------------------------------------------------- */
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserListTable } from "@/components/admin/UserListTable";
import { Badge } from "@/components/ui/badge";

/** Sunucu tarafı bileşen  */
export default async function AdminPage() {
  /* ------------------ yetki kontrolü ------------------ */
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/giris");

  /* ------------------ veriler ------------------------- */
  const [users, todayCount] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // bugün
        },
      },
    }),
  ]);

  const totalUsers = users.length;

  /* ------------------ UI ------------------------------ */
  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* sayfa başlığı */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Yönetim Paneli
        </h1>
        <p className="text-muted-foreground mt-1">
          Hoş geldin, {session.user.name ?? "Admin"}!
        </p>
      </header>

      {/* özet kartları */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <SummaryCard
          title="Toplam Kullanıcı"
          value={totalUsers.toLocaleString("tr-TR")}
        />
        <SummaryCard
          title="Bugün Eklenen"
          value={todayCount.toString()}
          accent="success"
        />
        <SummaryCard
          title="Rol Yönetimi"
          value="Aktif"
          accent="info"
        />
      </div>

      {/* kullanıcı tablosu */}
      <UserListTable users={users} />
    </section>
  );
}

/* ----------------------- alt bileşen ---------------------- */
type Accent = "default" | "success" | "info";
const COLORS: Record<Accent, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

function SummaryCard({
  title,
  value,
  accent = "default",
}: {
  title: string;
  value: string;
  accent?: Accent;
}) {
  return (
    <div className="rounded-xl bg-card shadow-sm border border-border p-6 flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {title}
      </span>

      <h2 className="text-2xl font-bold leading-8">{value}</h2>

      {/* durum rozeti */}
      <Badge className={`self-start mt-2 ${COLORS[accent]}`}>
        {accent === "success"
          ? "Güncel"
          : accent === "info"
          ? "Bilgi"
          : "Genel"}
      </Badge>
    </div>
  );
}
