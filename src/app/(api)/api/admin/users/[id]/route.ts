// app/(api)/api/admin/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";       // ← auth.ts dosyanızdan
import { prisma } from "@/lib/prisma"; // Prisma Client'ınız için
import { Role } from "@prisma/client"; // Rol enum'u için

// Yardımcı Fonksiyon: Yetki Kontrolü
// Not: `auth()` helper'ı Next.js App Router API Yolları'nda (Route Handlers)
// NextRequest'i otomatik olarak algılar. Bu yüzden burada 'req' parametresine
// doğrudan ihtiyacımız yok. Onu tamamen fonksiyon imzasından kaldırıyoruz.
async function checkAdminAuthorization(): Promise<NextResponse | null> {
    const session = await auth(); // NextAuth v5'in 'auth' helper'ını argümansız çağırın.

    // Oturum yoksa veya admin değilse erişimi engelle
    if (!session || !session.user || session.user.role !== Role.ADMIN) {
        return NextResponse.json(
            { message: "Erişim reddedildi. Sadece Adminler bu işlemi yapabilir." },
            { status: 403 }
        );
    }
    return null; // Admin yetkisi varsa null döner, işleme devam edilebilir.
}

// ======================= KULLANICI SİLME (DELETE) API =======================
export async function DELETE(
  req: NextRequest, // `req` parametresi burada hala var (Next.js kuralı) ama checkAdminAuthorization'a göndermiyoruz.
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const authError = await checkAdminAuthorization(); // checkAdminAuthorization artık parametre almıyor.
  if (authError) return authError;

  const userId = params.id; // `params.id` zaten bir stringdir, 'await' gerekmez.
  if (!userId) {
    return NextResponse.json({ message: "Kullanıcı ID'si eksik." }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json(
      { message: "Kullanıcı başarıyla silindi." },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Kullanıcı silme hatası (${userId}):`, (error as Error).message);
    return NextResponse.json(
      { message: "Kullanıcı silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// ======================= KULLANICI ROLÜ GÜNCELLEME (PATCH) API =======================
export async function PATCH(
  req: NextRequest, // `req` parametresi burada hala var (Next.js kuralı).
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const authError = await checkAdminAuthorization(); // checkAdminAuthorization artık parametre almıyor.
  if (authError) return authError;

  const userId = params.id; // `params.id` direkt string.
  if (!userId) {
    return NextResponse.json({ message: "Kullanıcı ID'si eksik." }, { status: 400 });
  }

  const { role } = await req.json(); // `req.json()` bir Promise döner, await zorunlu.

  // Rol kontrolü: Enum değerlerinize göre.
  if (!role || (role !== Role.STANDART_KULLANICI && role !== Role.ADMIN)) {
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
    console.error(`Kullanıcı rol güncelleme hatası (${userId}):`, (error as Error).message);
    return NextResponse.json(
      { message: "Kullanıcı rolü güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// ======================= TEK KULLANICI DETAY GETİRME (GET) API =======================
export async function GET(
  req: NextRequest, // `req` parametresi burada hala var (Next.js kuralı).
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const authError = await checkAdminAuthorization(); // checkAdminAuthorization artık parametre almıyor.
  if (authError) return authError;

  const userId = params.id; // `params.id` direkt string.
  if (!userId) {
    return NextResponse.json({ message: "Kullanıcı ID'si eksik." }, { status: 400 });
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
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`Kullanıcı detay çekme hatası (${userId}):`, (error as Error).message);
    return NextResponse.json(
      { message: "Kullanıcı detayı çekilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}