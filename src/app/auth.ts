// auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Prisma veritabanı istemcisini oluşturuyoruz.
const prisma = new PrismaClient();

// Auth.js'in ana yapılandırması
export const { handlers, auth, signIn, signOut } = NextAuth({
  // ADAPTÖR: Auth.js'e verileri nereye kaydedeceğini söyler.
  // Biz "Prisma'yı kullan ve verileri Neon'daki veritabanına bu şemaya göre kaydet" diyoruz.
  adapter: PrismaAdapter(prisma),

  // OTURUM STRATEJİSİ: JWT (JSON Web Tokens) kullanmak modern bir standarttır.
  session: { strategy: "jwt" },

  // GİRİŞ SAĞLAYICILARI (PROVIDERS): Kullanıcılar nasıl giriş yapabilir?
  providers: [
    // 1. Sağlayıcı: E-posta ve Şifre (Credentials)
    Credentials({
      // Bu fonksiyon, giriş sayfasındaki form gönderildiğinde çalışır.
      // `credentials` parametresi, formdan gelen { email, password } bilgilerini içerir.
      async authorize(credentials) {
        // Formdan gelen e-posta ve şifre var mı diye kontrol et.
        if (!credentials?.email || !credentials?.password) {
          return null; // Yoksa, girişi reddet.
        }

        // Veritabanında bu e-postaya sahip bir kullanıcı ara.
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // Eğer kullanıcı veritabanında bulunamadıysa, girişi reddet.
        if (!user) {
          return null;
        }

        // Kullanıcının şifresi veritabanında kayıtlı mı diye bak.
        // (Belki Google ile kayıt olmuştur, o zaman şifresi olmaz)
        if (!user.password) {
          return null;
        }

        // Formdan gelen şifre ile veritabanındaki HASH'LENMİŞ şifreyi karşılaştır.
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        // Eğer şifreler eşleşmiyorsa, girişi reddet.
        if (!isPasswordCorrect) {
          return null;
        }
        
        // Tüm kontrollerden geçtiyse, kullanıcı bilgilerini döndür ve girişi onayla.
        return user;
      },
    }),
    
    // İleride buraya Google, GitHub, Discord gibi başka sağlayıcılar ekleyebilirsiniz.
    // Örnek: Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })
  ],

  // ÖZEL SAYFALAR: Auth.js'e kendi özel sayfalarımızın yerini söylüyoruz.
  pages: {
    // Giriş yapılması gerektiğinde kullanıcıyı jenerik sayfaya değil,
    // bizim oluşturduğumuz /giris sayfasına yönlendir.
    signIn: '/giris',
  },
});