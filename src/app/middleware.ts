// middleware.ts

import { auth } from "@/app/auth";

export default auth;

// BU KISIM TÜM SİHRİ YAPIYOR!
// Middleware'in sadece ve sadece burada listelenen yollarda
// çalışmasını söylüyoruz.
export const config = {
  matcher: [
    // Korunmasını istediğiniz tüm yolları buraya listeleyin
    '/profilim/:path*',
    '/ayarlar/:path*',
    '/dashboard/:path*',
    // Örnek: '/admin', '/siparislerim' gibi...
  ],
};