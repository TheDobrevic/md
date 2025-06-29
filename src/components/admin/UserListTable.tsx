/* ----------------------------------------------------------------
   components/admin/UserListTable.tsx
----------------------------------------------------------------- */
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { EditUserModal } from "./EditUserModal";

/* --------------------------- tipler --------------------------- */
interface UserDisplayProps {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  image: string | null;
  createdAt: Date;
}
interface UserListTableProps {
  users: UserDisplayProps[];
}

/* ------------------------- renk haritası ----------------------- */
const ROLE_COLORS: Record<Role, string> = {
  STANDART_KULLANICI: "bg-blue-500",
  MD_SEVER: "bg-yellow-500",
  VIP_KULLANICI: "bg-purple-600",
  EDITOR: "bg-pink-500",
  CEVIRMEN: "bg-orange-500",
  ADMIN: "bg-green-600",
  KURUCU: "bg-red-600",
};

/* ============================================================= */
export function UserListTable({ users: initialUsers }: UserListTableProps) {
  const router = useRouter();

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserDisplayProps | null>(null);

  /* prop güncellenirse state senkronize et */
  React.useEffect(() => setUsers(initialUsers), [initialUsers]);

  /* ---------------------- filtreleme ---------------------- */
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  /* ---------------------- kullanıcı silme ----------------- */
  const handleDelete = async (userId: string) => {
    if (
      !window.confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz?")
    )
      return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Kullanıcı silinemedi.");
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("Kullanıcı başarıyla silindi!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.");
    }
  };

  /* ---------------------- modal kontrolleri --------------- */
  const handleOpenEditModal = (u: UserDisplayProps) => {
    setUserToEdit(u);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };
  const handleEditSuccess = () => router.refresh();

  /* ========================== UI ========================== */
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6">
      {/* başlık + arama */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Kullanıcılar</h2>
        <Input
          placeholder="Kullanıcı ara…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-xs rounded-md placeholder:text-muted-foreground"
        />
      </div>

      {/* tablo */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-14">Avatar</TableHead>
              <TableHead>İsim</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Kayıt</TableHead>
              <TableHead className="w-14 text-center">İşlem</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Hiç kullanıcı bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow
                  key={u.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {/* avatar */}
                  <TableCell>
                    {u.image ? (
                      <Image
                        src={u.image}
                        alt={`${u.name || "User"} avatar`}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        {u.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                    )}
                  </TableCell>

                  {/* isim / mail / rol */}
                  <TableCell className="font-medium">
                    {u.name ?? "Belirtilmemiş"}
                  </TableCell>
                  <TableCell>{u.email ?? "Belirtilmemiş"}</TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize text-white ${ROLE_COLORS[u.role]}`}
                    >
                      {u.role.toLowerCase()}
                    </Badge>
                  </TableCell>

                  {/* tarih */}
                  <TableCell className="text-right">
                    {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>

                  {/* menü */}
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Menü Aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleOpenEditModal(u)}>
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(u.id)}
                          className="text-red-600 focus:text-red-700"
                        >
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* edit modal */}
      {userToEdit && (
        <EditUserModal
          user={userToEdit}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
