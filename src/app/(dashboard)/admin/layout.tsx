// app/(dashboard)/admin/layout.tsx
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/giris");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 shrink-0 border-r bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">A</span>
            </div>
            <h2 className="text-lg font-bold">Admin Panel</h2>
          </div>
          <AdminNav />
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}