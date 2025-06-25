import type { NextConfig } from "next";

// nextConfig objesini NextConfig tipiyle tanımlıyoruz.
// Bu bize otomatik tamamlama ve tip kontrolü sağlar.
const nextConfig: NextConfig = {
  
  // ----- YENİ KODU BURAYA EKLİYORUZ -----
  async rewrites() {
    return [
      {
        source: '/nasil-cevirmen-olurum',
        destination: '/basvuru/nasil-cevirmen-olurum', // App Router için: '/basvuru/nasil-cevirmen-olurum'
      },
      {
        source: '/nasil-editor-olurum',
        destination: '/basvuru/nasil-editor-olurum', // App Router için: '/basvuru/nasil-editor-olurum'
      },
      // Bilgilendirme sayfaları için de aynı mantık
      {
        source: '/sss',
        destination: '/bilgilendirme/sss',
      },
      {
        source: '/cevirmen-kilavuzu',
        destination: '/bilgilendirme/cevirmen-kilavuzu',
      },
      {
        source: '/imla-yazim-kilavuzu',
        destination: '/bilgilendirme/imla-yazim-kilavuzu',
      },
      {
        source: '/gizlilik-sozlesmesi',
        destination: '/bilgilendirme/gizlilik-sozlesmesi',
      },
    ];
  },
};

export default nextConfig;