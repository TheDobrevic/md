// src/app/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      // Bu kısım aynı kalıyor, dokunmaya gerek yok.
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (isPasswordCorrect) {
            return user;
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: '/giris',
  },

  callbacks: {
    // --- YENİ EKLENEN YETKİLENDİRME CALLBACK'İ ---
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // /admin ile başlayan bir yola erişilmeye çalışılıyorsa:
      if (pathname.startsWith('/admin')) {
        // Kullanıcının rolü ADMIN ise 'true' (izin ver), değilse 'false' (reddet) döner.
        return auth?.user?.role === 'ADMIN';
      }

      // Diğer korumalı rotalar için (profilim vb.)
      // Sadece giriş yapmış olmak yeterlidir.
      // Eğer kullanıcı giriş yapmışsa, `isLoggedIn` true olur ve erişime izin verilir.
      if (isLoggedIn) return true;

      // Yukarıdaki koşullar sağlanmazsa (kullanıcı giriş yapmamışsa)
      // hiçbir korumalı sayfaya erişemez. `false` dönünce kullanıcı
      // otomatik olarak 'signIn' sayfasına yönlendirilir.
      return false;
    },
    // ---------------------------------------------

    // Mevcut jwt ve session callback'lerin aynı kalıyor.
    // Rol bilgisini token'a ve session'a eklemek için bunlar çok önemli.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string;
        session.user.image = token.image as string | null;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});