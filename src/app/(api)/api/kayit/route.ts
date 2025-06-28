// app/api/auth/kayit/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    // 1. Gerekli bilgiler eksik mi diye kontrol et
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 } // Bad Request
      );
    }

    // 2. Bu e-posta zaten kullanımda mı diye kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor." },
        { status: 409 } // Conflict
      );
    }

    // 3. ŞİFREYİ HASH'LE! Bu en önemli güvenlik adımıdır.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Yeni kullanıcıyı veritabanına (Neon'a) kaydet
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Veritabanına hash'lenmiş şifre kaydedilir
      },
    });
    
    // Her şey yolundaysa başarı mesajı gönder
    return NextResponse.json({ message: "Kayıt başarılı!" }, { status: 201 }); // Created

  } catch (error) {
    console.error("KAYIT SIRASINDA HATA:", error);
    return NextResponse.json(
      { error: "Sunucuda bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 } // Internal Server Error
    );
  }
}