// components/admin/EditUserModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Role } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditingUserProps {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
}

interface EditUserModalProps {
  user: EditingUserProps | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  /* --------------------------- state --------------------------- */
  const [selectedRole, setSelectedRole] = useState<Role>(
    user?.role ?? Role.STANDART_KULLANICI
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roleOptions = Object.values(Role);

  /* ----------------------- sync on open ------------------------ */
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setError(null);
    }
  }, [user]);

  if (!user) return null; // güvenlik

  /* ------------------------ handlers --------------------------- */
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Kullanıcı rolü güncellenemedi.");
      }
      toast.success("Kullanıcı rolü başarıyla güncellendi.");
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /* ======================== UI ======================== */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Özel, opak arkaplan + blur */}
      <DialogOverlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

      <DialogContent className="z-50 w-full max-w-md rounded-xl bg-card text-card-foreground shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {user.name || user.email} – Rol Düzenle
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Rol değişiklikleri kullanıcı yetkilerini doğrudan etkiler.
          </DialogDescription>
        </DialogHeader>

        {/* form */}
        <div className="space-y-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rol
            </Label>

            <Select
              value={selectedRole}
              onValueChange={(v) => setSelectedRole(v as Role)}
            >
              <SelectTrigger className="col-span-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>

              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
                    {r.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md"
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="rounded-md"
          >
            {isLoading ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
