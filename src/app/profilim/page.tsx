'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePage() {
  // Middleware sayesinde buraya sadece authenticated kullanıcılar gelebilir,
  // bu yüzden useEffect ile kontrol etmeye gerek yok.
  const { data: session, status } = useSession();

  // Oturum bilgisi client'a yüklenirken bir bekleme durumu göstermek yine de iyidir.
  if (status === 'loading') {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Profil Yükleniyor...</p>
        </div>
    );
  }

  // Oturum açılmışsa (middleware zaten bunu garantiledi)
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-6 text-center font-pixelify">Profilim</h1>
          
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profil Fotoğrafı"
              width={100}
              height={100}
              className="rounded-full mx-auto mb-4 border-2 border-gray-300"
            />
          )}

          <div className="text-left space-y-4 font-sans">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">İsim:</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{session.user?.name || 'Belirtilmemiş'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">E-posta:</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{session.user?.email || 'Belirtilmemiş'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Normalde buraya hiç düşmemesi gerekir ama bir fallback olarak null dönebiliriz.
  return null;
}