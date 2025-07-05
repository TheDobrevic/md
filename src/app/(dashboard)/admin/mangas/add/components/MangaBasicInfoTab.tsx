'use client';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MangaCreateData } from '@/lib/validations/manga';

const statusOptions = [
  { value: 'YAYIN_BEKLENIYOR', label: 'Yayın Bekleniyor' },
  { value: 'DEVAM_EDIYOR', label: 'Devam Ediyor' },
  { value: 'TAMAMLANDI', label: 'Tamamlandı' },
  { value: 'DURDURULDU', label: 'Durduruldu' },
  { value: 'IPTAL_EDILDI', label: 'İptal Edildi' },
];

interface Props {
  control: Control<MangaCreateData>;
}

export function MangaBasicInfoTab({ control }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Temel Bilgiler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık *</FormLabel>
              <FormControl>
                <Input placeholder="Manga başlığını girin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Manga hakkında açıklama yazın..." 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durum *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Kapak Resmi URL'si"}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yazar</FormLabel>
                <FormControl>
                  <Input placeholder="Yazar adı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Çizer</FormLabel>
                <FormControl>
                  <Input placeholder="Çizer adı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yayınevi</FormLabel>
                <FormControl>
                  <Input placeholder="Yayınevi adı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}