'use client';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagInput } from './TagInput';
import { MangaCreateData } from '@/lib/validations/manga';

const countries = [{ value: 'JP', label: 'Japonya' }, { value: 'KR', label: 'Güney Kore' }, { value: 'CN', label: 'Çin' }];

interface Props {
  control: Control<MangaCreateData>;
}

export function MangaClassificationTab({ control }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle>Sınıflandırma ve Detaylar</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Türler</FormLabel>
              <FormControl><TagInput {...field} placeholder="Yeni tür ekle..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiketler</FormLabel>
              <FormControl><TagInput {...field} placeholder="Yeni etiket ekle..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="alternativeNames"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternatif İsimler</FormLabel>
              <FormControl><TagInput {...field} placeholder="Yeni alternatif isim ekle..." /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="releaseYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Çıkış Yılı</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={control}
            name="country"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Ülke</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Ülke seçin" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {countries.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        </div>
      </CardContent>
    </Card>
  );
}