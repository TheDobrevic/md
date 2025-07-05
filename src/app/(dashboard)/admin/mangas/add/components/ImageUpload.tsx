'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string; // Bu değer formdan gelen URL olacak
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ÖNEMLİ: Bu örnekte base64 kullanıyoruz. Üretim ortamı için
      // presigned URL'ler ile doğrudan bulut depolamaya (S3, Cloudinary vb.)
      // yüklemek daha verimli ve doğrudur.
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result); // Formu base64 string ile güncelle
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemove = () => {
    setPreview(null);
    onChange('');
  }

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-40 h-56 group">
          <Image src={preview} alt="Kapak önizlemesi" layout="fill" objectFit="cover" className="rounded-md" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">Resim Yükle</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}