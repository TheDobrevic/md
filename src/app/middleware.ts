// middleware.ts
export { auth as middleware } from "@/app/auth";

// Hangi sayfaların korunacağını burada belirtirsiniz.
// Örn: /profilim, /ayarlar, /dashboard vb. tüm yollar koruma altına alınır.
export const config = {
  matcher: ["/profilim", "/ayarlar", "/dashboard/:path*"],
};