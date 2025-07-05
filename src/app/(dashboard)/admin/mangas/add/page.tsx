'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { mangaCreateSchema, MangaCreateData } from '@/lib/validations/manga';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MangaBasicInfoTab } from './components/MangaBasicInfoTab';
import { MangaClassificationTab } from './components/MangaClassificationTab';
import { MangaSeoTab } from './components/MangaSeoTab';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddMangaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<MangaCreateData>({
    resolver: zodResolver(mangaCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'YAYIN_BEKLENIYOR', // Bu değer artık zorunlu
      genres: [],
      tags: [],
      alternativeNames: [],
      releaseYear: new Date().getFullYear(),
      coverImage: '',
      country: '',
      slug: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      author: '',
      artist: '',
      publisher: '',
    },
  });

  async function onSubmit(data: MangaCreateData) {
    setLoading(true);
    try {
      // Boş stringleri undefined'a çevir
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === '' ? undefined : value
        ])
      );

      const response = await fetch('/api/admin/mangas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bir hata oluştu.');
      }
      
      const result = await response.json();
      console.log('Manga oluşturuldu:', result);
      
      alert('Manga başarıyla oluşturuldu!');
      router.push('/admin/mangas');
      router.refresh();
      
    } catch (error) {
      console.error('Manga oluşturma hatası:', error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/mangas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Geri
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Yeni Manga Ekle</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
              <TabsTrigger value="classification">Sınıflandırma</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-6">
              <MangaBasicInfoTab control={form.control} />
            </TabsContent>
            
            <TabsContent value="classification" className="mt-6">
              <MangaClassificationTab control={form.control} />
            </TabsContent>
            
            <TabsContent value="seo" className="mt-6">
              <MangaSeoTab control={form.control} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8">
            <Button type="submit" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Ekleniyor...' : 'Mangayı Oluştur'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}