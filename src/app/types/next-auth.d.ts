import { type DefaultSession } from "next-auth";
import type { Role } from '@prisma/client' 
import 'next-auth';
import 'next-auth/jwt';

// `declare module` ifadesi, var olan modüllerin tiplerini genişletmemizi sağlar.
// İçeride `JWT` veya `NextAuth` tiplerini doğrudan kullanmadığımız için 
// onları import etmemize gerek yoktur.

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role; // Rolü ekliyoruz
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth" {
  /** İstemci tarafında `useSession` ile gelen `user` objesi. */
  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  /** authorize'dan dönen ve `jwt` callback'ine gönderilen `user` objesi. */
  interface User {
    id: string;
    role: Role;
  }
}