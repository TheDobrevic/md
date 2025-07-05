'use client';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MangaCreateData } from '@/lib/validations/manga';

interface Props {
  control: Control<MangaCreateData>;
}

export function MangaSeoTab({ control }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO & Görünürlük</CardTitle>
        <CardDescription>Arama motoru optimizasyonu ve URL ayarları.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL (Slug)</FormLabel>
              <FormControl><Input placeholder="otomatik-oluşturulur" {...field} /></FormControl>
              <FormDescription>Boş bırakılırsa başlıktan otomatik olarak oluşturulur.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="seoTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Başlığı</FormLabel>
              <FormControl><Input placeholder="Google'da görünecek başlık" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="seoDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Açıklaması</FormLabel>
              <FormControl><Textarea placeholder="Google'da görünecek meta açıklama" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}