// components/admin/UserListTable.tsx
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation'; // Sayfa yenilemek için

// Shadcn/UI bileşenleri
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Button bileşenini de import edelim
import { toast } from 'sonner'; // bildirimler için

// YENİ EKLENDİ: EditUserModal komponenti
import { EditUserModal } from './EditUserModal';

// Kullanıcı verisinin tipini tanımla
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

export function UserListTable({ users: initialUsers }: UserListTableProps) { // Prop ismini değiştirdim, içerde state'e alacağız
  const router = useRouter(); // router objesini aldık
  const [users, setUsers] = useState(initialUsers); // Kullanıcı listesini state'e alıyoruz
  const [searchTerm, setSearchTerm] = useState('');
  
  // Düzenleme modası için state'ler
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserDisplayProps | null>(null);

  // Users prop'u dışarıdan değiştiğinde state'i güncelle (Parent refresh yaparsa)
  // Bu useEffect sayesinde, parent'ta (AdminPage) router.refresh() çağrıldığında
  // UserListTable'ın users prop'u güncellenir ve bu da iç state'i senkronize eder.
  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Arama filtresi mantığı
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.role.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [users, searchTerm]); // users state'ine göre filtrele

  // Silme işlemi
  const handleDelete = async (userId: string) => {
    if (!window.confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kullanıcı silinemedi.');
      }

      // Kullanıcı listesini state'ten manuel olarak kaldırarak UI'ı anında güncelle
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success("Kullanıcı başarıyla silindi!");

      // Eğer API çağrısından sonra garantili bir re-fetch istersen:
      // router.refresh(); // Bu, Server Component'i tekrar render ettirir ve users prop'unu günceller.
      // Ya da `revalidatePath('/admin')` kullanarak belirli bir path'in cache'ini invalidate edebilirsiniz (eğer route handler'daysanız).

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
      console.error("Kullanıcı silme hatası:", errorMessage);
      toast.error(errorMessage);
    }
  };

  // Düzenleme modalını açma
  const handleOpenEditModal = (user: UserDisplayProps) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  // Düzenleme modalını kapatma
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null); // Temizle
  };

  // Düzenleme başarılı olduğunda (modal'dan callback)
  const handleEditSuccess = () => {
    // API çağrısı zaten yapıldı, burada sadece router'ı yeniliyoruz
    // Router refresh, AdminPage'deki `users` verisini yeniden çeker
    // ve bu da UserListTable'daki initialUsers'ı günceller.
    router.refresh(); 
  };


  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Kullanıcılar</h2>
        <Input
          type="text"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="w-[60px]">Avatar</TableHead>
              <TableHead>İsim</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Kayıt Tarihi</TableHead>
              <TableHead className="w-[50px] text-center">Eylemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                  Hiç kullanıcı bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={`${user.name || 'User'}'s avatar`}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs">
                        {user.name ? user.name[0]?.toUpperCase() : '?'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{user.name || "Belirtilmemiş"}</TableCell>
                  <TableCell>{user.email || "Belirtilmemiş"}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === Role.ADMIN ? "default" : "secondary"} className={`${user.role === Role.ADMIN ? 'bg-green-500 dark:bg-green-600' : 'bg-blue-500 dark:bg-blue-600'} text-white capitalize`}>
                      {user.role.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Menü Aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleOpenEditModal(user)}>
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600 focus:text-red-700">
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

      {/* Düzenleme Modalı */}
      {userToEdit && ( // Sadece düzenlenecek kullanıcı varsa modal'ı render et
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