// app/(api)/api/admin/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth"; // Auth.js helper'ınız
import { prisma } from "@/lib/prisma"; // Prisma Client'ınız
import { Role } from "@prisma/client"; // Rol enum'u

export const runtime = "nodejs"; // Node.js çalışma zamanı (Next.js tip hatası için kritik olabilir)

// Yardımcı Fonksiyon: Yetki Kontrolü
// >>>>>>> ÖNEMLİ DEĞİŞİKLİK BURADA <<<<<<<
// Fonksiyon imzasından `req: NextRequest` parametresini kaldırdık.
// `auth()` helper'ı Next.js Route Handler'ları içinde `Request` objesini
// otomatik olarak kendi ortamından alır.
async function checkAdminAuthorization(): Promise<NextResponse | null> {
  const session = await auth(); // Auth() argümansız çağrılır

  if (!session || !session.user || session.user.role !== Role.ADMIN) {
    return NextResponse.json(
      { message: "Erişim reddedildi. Sadece Adminler bu işlemi yapabilir." },
      { status: 403 }
    );
  }
  return null;
}

// Params için Next.js'in beklentisine uygun Promise tip tanımı
interface RouteParams {
  id: string;
}

// Tüm HTTP Metotları için Ortak Argüman Yapısı
interface RouteHandlerArgs {
  params: Promise<RouteParams>; // Next.js dokümantasyonundaki gibi Promise olarak belirliyoruz
}

// ======================= KULLANICI SİLME (DELETE) API =======================
export async function DELETE(
  req: NextRequest, // `req` parametresi Next.js kuralı olarak burada kalır
  { params }: RouteHandlerArgs
): Promise<NextResponse> {
  // >>>>>>> ÖNEMLİ DEĞİŞİKLİK BURADA <<<<<<<
  // `checkAdminAuthorization` fonksiyonuna `req` artık gönderilmiyor.
  const authError = await checkAdminAuthorization();
  if (authError) return authError;

  const { id: userId } = await params; // Next.js örneğindeki gibi params await ediliyor
  if (!userId) {
    return NextResponse.json(
      { message: "Kullanıcı ID'si eksik." },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json(
      { message: "Kullanıcı başarıyla silindi." },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `Kullanıcı silme hatası (${userId}):`,
      (error as Error).message
    );
    return NextResponse.json(
      { message: "Kullanıcı silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// ======================= KULLANICI ROLÜ GÜNCELLEME (PATCH) API =======================
export async function PATCH(
  req: NextRequest,
  { params }: RouteHandlerArgs
): Promise<NextResponse> {
  // >>>>>>> ÖNEMLİ DEĞİŞİKLİK BURADA <<<<<<<
  // `checkAdminAuthorization` fonksiyonuna `req` artık gönderilmiyor.
  const authError = await checkAdminAuthorization();
  if (authError) return authError;

  const { id: userId } = await params; // Next.js örneğindeki gibi params await ediliyor
  if (!userId) {
    return NextResponse.json(
      { message: "Kullanıcı ID'si eksik." },
      { status: 400 }
    );
  }

  const { role } = await req.json(); // `req.json()` bir Promise olduğu için await ZORUNLU.

  if (!role || !Object.values(Role).includes(role)) {
    return NextResponse.json(
      { message: "Geçersiz veya eksik rol belirtildi." },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(
      `Kullanıcı rol güncelleme hatası (${userId}):`,
      (error as Error).message
    );
    return NextResponse.json(
      { message: "Kullanıcı rolü güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// ======================= TEK KULLANICI DETAY GETİRME (GET) API =======================
export async function GET(
  req: NextRequest,
  { params }: RouteHandlerArgs
): Promise<NextResponse> {
  // >>>>>>> ÖNEMLİ DEĞİŞİKLİK BURADA <<<<<<<
  // `checkAdminAuthorization` fonksiyonuna `req` artık gönderilmiyor.
  const authError = await checkAdminAuthorization();
  if (authError) return authError;

  const { id: userId } = await params; // Next.js örneğindeki gibi params await ediliyor
  if (!userId) {
    return NextResponse.json(
      { message: "Kullanıcı ID'si eksik." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(
      `Kullanıcı detay çekme hatası (${userId}):`,
      (error as Error).message
    );
    return NextResponse.json(
      { message: "Kullanıcı detayı çekilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
