// middleware.ts

import { auth } from '@/app/auth'; // Sadece bunu import et.
export default auth; // Ve sadece bunu export et.

// Bu kısım aynı kalıyor ve hala tüm sihri yapıyor!
export const config = {
  matcher: [
    // Korunmasını istediğiniz tüm yolları buraya listeleyin
    '/profilim/:path*',
    '/ayarlar/:path*',
    '/admin/:path*',
  ],
};