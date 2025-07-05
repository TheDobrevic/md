// lib/validations/manga.ts
import { z } from 'zod';

export const mangaCreateSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  description: z.string().optional(),
  status: z.enum(['DEVAM_EDIYOR', 'TAMAMLANDI', 'DURDURULDU', 'YAYIN_BEKLENIYOR', 'IPTAL_EDILDI']),
  genres: z.array(z.string()),
  tags: z.array(z.string()),
  alternativeNames: z.array(z.string()),
  releaseYear: z.number().min(1900).max(new Date().getFullYear() + 2),
  coverImage: z.string().optional(),
  // Yeni alanlar - component'lerde kullanılan
  country: z.string().optional(),
  slug: z.string().optional(),
  // SEO alanları
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  // Diğer alanlar (ihtiyacınıza göre ekleyin)
  author: z.string().optional(),
  artist: z.string().optional(),
  publisher: z.string().optional(),
});

export type MangaCreateData = z.infer<typeof mangaCreateSchema>;