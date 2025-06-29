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
  const [selectedRole, setSelectedRole] = useState<Role>(
    user?.role ?? Role.STANDART_KULLANICI
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roleOptions = Object.values(Role);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setError(null);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        const { message } = await response.json();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* radius-2xl + shadow-xl = yumuşak, modern modal  */}
      <DialogContent className="sm:max-w-[430px] rounded-2xl shadow-xl border border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {user.name || user.email} için Rol Düzenle
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Rol değişiklikleri kullanıcı yetkilerini doğrudan etkiler.
          </DialogDescription>
        </DialogHeader>

        {/* Form alanları */}
        <div className="space-y-6 py-2">
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="role" className="col-span-1 text-right">
              Rol
            </Label>

            <Select
              onValueChange={(value) => setSelectedRole(value as Role)}
              value={selectedRole}
            >
              {/* SelectTrigger’a ekstra stil: yumuşak border ve focus halkası */}
              <SelectTrigger className="col-span-3 focus:ring-2 focus:ring-primary/50 focus:border-primary rounded-md">
                <SelectValue placeholder="Bir Rol Seç" />
              </SelectTrigger>

              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="capitalize" // ADMIN → Admin
                  >
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

        <DialogFooter className="mt-4">
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
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
