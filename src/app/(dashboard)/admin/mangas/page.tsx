// app/(dashboard)/admin/mangas/page.tsx
import { Construction } from "lucide-react";

export default function MangaPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="p-4 rounded-full bg-muted">
        <Construction className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Manga Yönetimi</h2>
        <p className="text-muted-foreground max-w-md">
          Manga yönetim bölümü şu anda geliştirme aşamasında. 
          Yakında burada manga ekleme, düzenleme ve silme işlemlerini yapabileceksiniz.
        </p>
      </div>
    </div>
  );
}