// components/admin/EditUserModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Role } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner'; // bildirimler için (eğer kullanmıyorsanız kaldırılabilelir veya baska toast kütüphanesi kullanın)

// Modaldan dönecek kullanıcı tipi, kısmen seçilen özellikler
interface EditingUserProps {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
}

interface EditUserModalProps {
  user: EditingUserProps | null; // Düzenlenecek kullanıcı (boş veya dolu gelebilir)
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // İşlem başarılı olduğunda UserListTable'ı güncellemek için
}

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role | string>(''); // Role tipini veya string alabilir
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal açıldığında veya user değiştiğinde state'i güncelleyin
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setError(null); // Her açılışta hataları temizle
    } else {
      setSelectedRole(''); // Kullanıcı yoksa rolü temizle
    }
  }, [user]);

  if (!user) return null; // Kullanıcı verisi gelmediyse modal'ı render etme

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole as Role }), // Seçili rolü gönder
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kullanıcı rolü güncellenemedi.');
      }

      // const updatedUser = await response.json(); // Güncellenen kullanıcı verisi
      toast.success("Kullanıcı rolü başarıyla güncellendi.");
      onSuccess(); // Parent componenti tetikleyip tabloyu güncelle
      onClose();   // Modal'ı kapat
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
      toast.error(error || "Rol güncellenirken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.name || user.email} için Rol Düzenle</DialogTitle>
          <DialogDescription>
            {user.name ? `"${user.name}" adlı kullanıcının rolünü düzenliyorsunuz.` : `E-posta adresi ${user.email} olan kullanıcının rolünü düzenliyorsunuz.`}
            Rol değişiklikleri kullanıcı yetkilerini doğrudan etkiler.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rol
            </Label>
            <Select onValueChange={(value) => setSelectedRole(value as Role)} value={selectedRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Bir Rol Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.STANDART_KULLANICI}>{Role.STANDART_KULLANICI}</SelectItem>
                <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}