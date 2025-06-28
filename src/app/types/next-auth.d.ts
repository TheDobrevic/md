import { type DefaultSession } from "next-auth";

// `declare module` ifadesi, var olan modüllerin tiplerini genişletmemizi sağlar.
// İçeride `JWT` veya `NextAuth` tiplerini doğrudan kullanmadığımız için 
// onları import etmemize gerek yoktur.

declare module "next-auth/jwt" {
  /** JWT token'ımızın içine eklediğimiz özel alanlar. */
  interface JWT {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  }
}

declare module "next-auth" {
  /** İstemci tarafında `useSession` ile gelen `user` objesi. */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /** authorize'dan dönen ve `jwt` callback'ine gönderilen `user` objesi. */
  interface User {
    id: string;
  }
}