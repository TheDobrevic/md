// app/(dashboard)/admin/mangas/DeleteButton.tsx
'use client'

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  mangaId: string;
  mangaTitle: string;
}

export default function DeleteButton({ mangaId, mangaTitle }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`"${mangaTitle}" adlı mangayı silmek istediğinizden emin misiniz?`)) {
      try {
        const response = await fetch(`/api/admin/mangas/${mangaId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.refresh(); // Sayfayı yeniler
        } else {
          alert('Silme işlemi sırasında bir hata oluştu');
        }
      } catch (error) {
        console.error('Silme hatası:', error);
        alert('Silme işlemi sırasında bir hata oluştu');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
      title="Sil"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}