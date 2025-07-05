// app/(dashboard)/admin/mangas/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

const mangaStatuses = [
  { value: 'DEVAM_EDIYOR', label: 'Devam Ediyor' },
  { value: 'TAMAMLANDI', label: 'Tamamlandı' },
  { value: 'DURDURULDU', label: 'Durduruldu' },
  { value: 'YAYIN_BEKLENIYOR', label: 'Yayın Bekleniyor' }
];

const commonGenres = [
  'Aksiyon', 'Macera', 'Komedi', 'Drama', 'Fantastik', 'Korku', 
  'Romantik', 'Bilim Kurgu', 'Slice of Life', 'Spor', 'Gerilim', 'Yaşam'
];

export default function AddMangaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    status: 'DEVAM_EDIYOR'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addGenre = (genre: string) => {
    if (genre.trim() && !genres.includes(genre.trim())) {
      setGenres(prev => [...prev, genre.trim()]);
      setNewGenre('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres(prev => prev.filter(genre => genre !== genreToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Manga başlığı gereklidir!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/mangas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          genres
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Manga başarıyla eklendi!');
        router.push('/admin/mangas');
      } else {
        alert(result.error || 'Bir hata oluştu!');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Manga eklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/mangas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yeni Manga Ekle</h1>
          <p className="text-muted-foreground">
            Sisteme yeni bir manga ekleyin
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Manga Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Başlık */}
            <div className="space-y-2">
              <Label htmlFor="title">Manga Başlığı *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Örn: One Piece"
                required
              />
            </div>

            {/* Açıklama */}
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Manga hakkında kısa bir açıklama..."
                rows={4}
              />
            </div>

            {/* Yazar */}
            <div className="space-y-2">
              <Label htmlFor="author">Yazar</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Örn: Eiichiro Oda"
              />
            </div>

            {/* Durum */}
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mangaStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Türler */}
            <div className="space-y-4">
              <Label>Türler</Label>
              
              {/* Seçili türler */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <div
                      key={genre}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                    >
                      <span>{genre}</span>
                      <button
                        type="button"
                        onClick={() => removeGenre(genre)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Yaygın türler */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {commonGenres.map((genre) => (
                  <Button
                    key={genre}
                    type="button"
                    variant={genres.includes(genre) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addGenre(genre)}
                    disabled={genres.includes(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>

              {/* Özel tür ekleme */}
              <div className="flex gap-2">
                <Input
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="Özel tür ekle..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addGenre(newGenre);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addGenre(newGenre)}
                  disabled={!newGenre.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/admin/mangas">
                <Button type="button" variant="outline" disabled={loading}>
                  İptal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ekleniyor...' : 'Manga Ekle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}