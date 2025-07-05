// app/(api)/api/admin/mangas/[id]/route.ts
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Next.js 15+ için params artık Promise olarak geliyor
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Params'ı await ile al
    const { id } = await context.params;
    
    const session = await auth();
    if (!session || !['ADMIN', 'EDITOR', 'KURUCU'].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    const manga = await prisma.manga.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        seasons: {
          include: {
            chapters: true
          }
        }
      }
    });

    if (!manga) {
      return NextResponse.json(
        { error: "Manga bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: manga
    });

  } catch (error) {
    console.error("Manga getirme hatası:", error);
    return NextResponse.json(
      { error: "Manga getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Params'ı await ile al
    const { id } = await context.params;
    
    const session = await auth();
    if (!session || !['ADMIN', 'EDITOR', 'KURUCU'].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      author,
      status,
      genres,
    } = body;

    // Zorunlu alanları kontrol et
    if (!title || !author || !status) {
      return NextResponse.json(
        { error: "Başlık, yazar ve durum alanları zorunludur" },
        { status: 400 }
      );
    }

    // Manga'nın varlığını kontrol et
    const existingManga = await prisma.manga.findUnique({
      where: { id }
    });

    if (!existingManga) {
      return NextResponse.json(
        { error: "Manga bulunamadı" },
        { status: 404 }
      );
    }

    // Aynı başlıkta başka manga var mı kontrol et (kendi haricinde)
    const duplicateManga = await prisma.manga.findFirst({
      where: {
        title: title.trim(),
        id: { not: id }
      }
    });

    if (duplicateManga) {
      return NextResponse.json(
        { error: "Bu başlıkta başka bir manga zaten mevcut" },
        { status: 409 }
      );
    }

    // Manga'yı güncelle
    const updatedManga = await prisma.manga.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        author: author.trim(),
        status: status,
        genres: genres || [],
        slug: title.trim().toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim()
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Manga başarıyla güncellendi",
      data: updatedManga
    });

  } catch (error) {
    console.error("Manga güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Manga güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Params'ı await ile al
    const { id } = await context.params;
    
    const session = await auth();
    if (!session || !['ADMIN', 'KURUCU'].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    // Manga'nın varlığını kontrol et
    const existingManga = await prisma.manga.findUnique({
      where: { id },
      include: {
        seasons: {
          include: {
            chapters: true
          }
        }
      }
    });

    if (!existingManga) {
      return NextResponse.json(
        { error: "Manga bulunamadı" },
        { status: 404 }
      );
    }

    // İlişkili verileri sil (Prisma cascade silme yapmıyorsa)
    // Önce episodes'ları sil
    for (const season of existingManga.seasons) {
      await prisma.chapter.deleteMany({
        where: { seasonId: season.id }
      });
    }

    // Sonra seasons'ları sil
    await prisma.season.deleteMany({
      where: { mangaId: id }
    });

    // Son olarak manga'yı sil
    await prisma.manga.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Manga başarıyla silindi"
    });

  } catch (error) {
    console.error("Manga silme hatası:", error);
    return NextResponse.json(
      { error: "Manga silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}