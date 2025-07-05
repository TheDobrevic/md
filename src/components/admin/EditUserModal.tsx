"use client";

import React, { useState, useEffect } from "react";
import { Role } from "@prisma/client";
import {
  Dialog,
  DialogContent,
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
import { User, Shield, Crown, Zap, Edit3, Globe, Settings, X } from "lucide-react";
import Image from "next/image";

interface EditingUserProps {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  image?: string | null;
}

interface EditUserModalProps {
  user: EditingUserProps | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLE_OPTIONS = {
  STANDART_KULLANICI: { label: "Standart Kullanıcı", icon: User },
  MD_SEVER: { label: "MD Sever", icon: Zap },
  VIP_KULLANICI: { label: "VIP Kullanıcı", icon: Crown },
  EDITOR: { label: "Editör", icon: Edit3 },
  CEVIRMEN: { label: "Çevirmen", icon: Globe },
  MODERATOR: {label: "Moderatör", icon: Zap},
  ADMIN: { label: "Administrator", icon: Shield },
  KURUCU: { label: "Kurucu", icon: Settings },
};

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role ?? Role.STANDART_KULLANICI);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (selectedRole === user.role) {
      toast.info("Rol değişikliği yapılmadı");
      return;
    }

    setIsLoading(true);
    
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
      
      toast.success("Kullanıcı rolü başarıyla güncellendi");
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = ROLE_OPTIONS[selectedRole];
  const CurrentIcon = currentRole.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Kullanıcı Rolü Düzenle
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {user.image ? (
              <Image 
                src={user.image} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100">{user.name || "İsimsiz Kullanıcı"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Role Selection */}
            <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Rol Seçimi
            </Label>
            
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <CurrentIcon className="h-4 w-4" />
                    {currentRole.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                {Object.entries(ROLE_OPTIONS).map(([value, { label, icon: Icon }]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                      {value === user.role && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          Mevcut
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Change Warning */}
          {selectedRole !== user.role && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>{ROLE_OPTIONS[user.role].label}</strong> → <strong>{currentRole.label}</strong>
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Bu değişiklik kullanıcının yetkilerini etkileyecektir.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || selectedRole === user.role}
          >
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}