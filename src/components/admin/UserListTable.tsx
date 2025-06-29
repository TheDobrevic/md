/* ----------------------------------------------------------------
   components/admin/UserListTable.tsx
----------------------------------------------------------------- */
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
import { MoreHorizontal, Edit, Trash2, Search, Users, UserCheck, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  STANDART_KULLANICI: "bg-gradient-to-r from-slate-500 to-slate-600 shadow-slate-500/25",
  MD_SEVER: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/25",
  VIP_KULLANICI: "bg-gradient-to-r from-purple-500 to-violet-600 shadow-purple-500/25",
  EDITOR: "bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/25",
  CEVIRMEN: "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/25",
  ADMIN: "bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/25",
  KURUCU: "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/25",
};

const ROLE_LABELS: Record<Role, string> = {
  STANDART_KULLANICI: "Standart Kullanıcı",
  MD_SEVER: "MD Sever",
  VIP_KULLANICI: "VIP Kullanıcı",
  EDITOR: "Editör",
  CEVIRMEN: "Çevirmen",
  ADMIN: "Admin",
  KURUCU: "Kurucu",
};

const ROLE_ICONS: Record<Role, React.ElementType> = {
  STANDART_KULLANICI: Users,
  MD_SEVER: UserCheck,
  VIP_KULLANICI: Users,
  EDITOR: Edit,
  CEVIRMEN: Users,
  ADMIN: UserCheck,
  KURUCU: UserCheck,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {/* başlık + arama */}
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Kullanıcı Yönetimi
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <UserCheck className="h-4 w-4" />
                  Toplam {users.length} kullanıcı • {filteredUsers.length} gösteriliyor
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="İsim, e-posta veya rol ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-96 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:shadow-md"
              />
              {searchTerm && (
                <motion.div 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    ✕
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* tablo */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 hover:from-gray-100/80 hover:to-gray-50/80 dark:hover:from-gray-900/80 dark:hover:to-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50">
                  <TableHead className="w-20 py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                    Avatar
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                    Kullanıcı Bilgileri
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">
                    Rol & Yetki
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-center">
                    Kayıt Tarihi
                  </TableHead>
                  <TableHead className="w-20 py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 text-center">
                    İşlemler
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <AnimatePresence>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48">
                        <motion.div 
                          className="flex flex-col items-center justify-center gap-4"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
                            <Users className="h-12 w-12 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {searchTerm ? "Arama sonucu bulunamadı" : "Henüz kullanıcı yok"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {searchTerm 
                                ? `"${searchTerm}" araması için sonuç bulunamadı`
                                : "Sistemde kayıtlı kullanıcı bulunmuyor"
                              }
                            </p>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u, index) => {
                      const RoleIcon = ROLE_ICONS[u.role];
                      return (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`
                            group transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 dark:hover:from-gray-800/30 dark:hover:to-gray-700/30
                            ${index % 2 === 0 
                              ? 'bg-white/50 dark:bg-gray-900/50' 
                              : 'bg-gray-50/30 dark:bg-gray-800/30'
                            }
                            border-b border-gray-100/50 dark:border-gray-800/50 hover:border-blue-200/50 dark:hover:border-gray-600/50
                          `}
                        >
                          {/* avatar */}
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center justify-center">
                              {u.image ? (
                                <motion.div 
                                  className="relative group-hover:scale-105 transition-transform duration-300"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Image
                                    src={u.image}
                                    alt={`${u.name || "User"} avatar`}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-300 shadow-lg"
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white dark:border-gray-900 shadow-sm"></div>
                                </motion.div>
                              ) : (
                                <motion.div 
                                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                  {u.name?.charAt(0).toUpperCase() ?? "?"}
                                </motion.div>
                              )}
                            </div>
                          </TableCell>

                          {/* kullanıcı bilgileri */}
                          <TableCell className="py-6 px-6">
                            <div className="space-y-2">
                              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 flex items-center gap-2">
                                {u.name ?? "Belirtilmemiş"}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {u.email ?? "E-posta belirtilmemiş"}
                              </div>
                            </div>
                          </TableCell>

                          {/* rol */}
                          <TableCell className="py-6 px-6">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge
                                className={`
                                  px-3 py-2 text-xs font-semibold text-white border-0 shadow-lg
                                  transition-all duration-300 hover:shadow-xl hover:scale-105
                                  ${ROLE_COLORS[u.role]}
                                  flex items-center gap-2 w-fit
                                `}
                              >
                                <RoleIcon className="h-3 w-3" />
                                {ROLE_LABELS[u.role]}
                              </Badge>
                            </motion.div>
                          </TableCell>

                          {/* tarih */}
                          <TableCell className="py-6 px-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(u.createdAt).toLocaleDateString("tr-TR", {
                                  day: "numeric",
                                  month: "short"
                                })}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(u.createdAt).getFullYear()}
                              </div>
                            </div>
                          </TableCell>

                          {/* menü */}
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-md"
                                    >
                                      <span className="sr-only">Menü Aç</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent 
                                  align="end" 
                                  className="w-52 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm"
                                >
                                  <DropdownMenuItem 
                                    onClick={() => handleOpenEditModal(u)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 cursor-pointer transition-all duration-200 rounded-lg mx-1 my-1"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Kullanıcı Düzenle
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 mx-2" />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(u.id)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer transition-all duration-200 rounded-lg mx-1 my-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Kalıcı Sil
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* edit modal */}
      <AnimatePresence>
        {userToEdit && (
          <EditUserModal
            user={userToEdit}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSuccess={handleEditSuccess}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}