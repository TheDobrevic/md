// app/(dashboard)/admin/mangas/page.tsx
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import { Suspense } from "react";
import SearchInput from "./SearchInput";
import DeleteButton from "./DeleteButton";
import Image from "next/image";

// Next.js 15+ için searchParams artık Promise
interface MangaListProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

async function MangaList({ searchParams }: MangaListProps) {
  // searchParams'ı await ile al
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const search = resolvedSearchParams.search || '';
  const limit = 10;

  const where = search ? {
    OR: [
      { title: { contains: search, mode: 'insensitive' as const } },
      { author: { contains: search, mode: 'insensitive' as const } },
      { artist: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {};

  const [mangas, total] = await Promise.all([
    prisma.manga.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { seasons: true } // chapters yerine seasons kullanıldı
        }
      }
    }),
    prisma.manga.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ONGOING': return 'Devam Ediyor';
      case 'COMPLETED': return 'Tamamlandı';
      case 'HIATUS': return 'Ara Verildi';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONGOING': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'HIATUS': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manga Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Toplam {total} manga bulunuyor
          </p>
        </div>
        <Link
          href="/admin/mangas/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Manga Ekle
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <SearchInput defaultValue={search} />
      </div>

      {/* Manga List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Manga
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Yazar/Çizer
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sezon
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Eklenme Tarihi
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mangas.map((manga) => (
                <tr key={manga.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {manga.coverImage && (
                        <Image
                          src={manga.coverImage}
                          alt={manga.title}
                          width={32}
                          height={48}
                          className="h-12 w-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{manga.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {manga.genres.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>Yazar: {manga.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(manga.status)}`}>
                      {getStatusText(manga.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {manga._count.seasons} sezon
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(manga.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Link
                        href={`/admin/mangas/${manga.id}`}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/mangas/${manga.id}/edit`}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteButton 
                        mangaId={manga.id} 
                        mangaTitle={manga.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mangas.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {search ? 'Arama sonucu bulunamadı' : 'Henüz manga eklenmemiş'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={{
                pathname: '/admin/mangas',
                query: { ...resolvedSearchParams, page: pageNum.toString() }
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pageNum === page
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MangaListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-5 w-32 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-8 bg-muted rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function MangaPage({ searchParams }: MangaListProps) {
  const session = await auth();
  if (!session || !['ADMIN', 'EDITOR', 'KURUCU'].includes(session.user.role)) {
    redirect("/giris");
  }

  return (
    <Suspense fallback={<MangaListSkeleton />}>
      <MangaList searchParams={searchParams} />
    </Suspense>
  );
}