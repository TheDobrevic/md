// app/(api)/api/admin/mangas/route.ts
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Oturum kontrolü - Schema'daki rol isimlerini kullan
    const session = await auth();
    if (!session || !['ADMIN', 'EDITOR', 'KURUCU'].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    // DEBUG: Session bilgilerini logla
    console.log("Session User:", {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      idType: typeof session.user.id
    });

    // User ID'sini kontrol et
    if (!session.user.id) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si bulunamadı" },
        { status: 400 }
      );
    }

    // Request body'sini al
    const body = await request.json();
    const {
      title,
      description,
      author,
      status,
      genres,
      // Kullanılmayan değişkenler kaldırıldı
      // artist,
      // tags,
      // coverImage,
      // releaseYear,
      // originalLanguage,
      // translationStatus,
      // ageRating,
      // source
    } = body;

    // Zorunlu alanları kontrol et
    if (!title || !author || !status) {
      return NextResponse.json(
        { error: "Başlık, yazar ve durum alanları zorunludur" },
        { status: 400 }
      );
    }

    // Kullanıcının varlığını kontrol et
    console.log("Kontrol edilecek User ID:", session.user.id);

    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!userExists) {
      // Debug için kullanıcıları listele
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true }
      });
      console.log("Tüm kullanıcılar:", allUsers);
      console.log("Aranan ID:", session.user.id);
      
      return NextResponse.json(
        { 
          error: "Kullanıcı bulunamadı",
          debug: {
            sessionUserId: session.user.id,
            sessionUserEmail: session.user.email,
            allUserIds: allUsers.map(u => u.id)
          }
        },
        { status: 404 }
      );
    }

    // Aynı başlıkta manga var mı kontrol et
    const existingManga = await prisma.manga.findFirst({
      where: {
        title: title.trim(),
      }
    });

    if (existingManga) {
      return NextResponse.json(
        { error: "Bu başlıkta bir manga zaten mevcut" },
        { status: 409 }
      );
    }

    // Veritabanına manga ekle
    const manga = await prisma.manga.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        author: author.trim(),
        // Schema'ya göre sadece bu alanları kullan
        status: status, // MangaStatus enum'ından olmalı
        genres: genres || [],
        createdById: session.user.id,
        slug: title.trim().toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // Özel karakterleri kaldır
          .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
          .trim()
        // Diğer alanlar schema'da yok, kaldırıldı
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
      message: "Manga başarıyla eklendi",
      data: manga
    });

  } catch (error) {
    console.error("Manga ekleme hatası:", error);
    
    // Prisma hatalarını kontrol et
    if (error instanceof Error) {
    if ('code' in error && error.code === 'P2003') {
      return NextResponse.json(
        { error: "Geçersiz kullanıcı referansı" },
        { status: 400 }
      );
    }
  }

    return NextResponse.json(
      { error: "Manga eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !['ADMIN', 'EDITOR', 'KURUCU'].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { author: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [mangas, total] = await Promise.all([
      prisma.manga.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          _count: {
            select: { seasons: true }
          }
        }
      }),
      prisma.manga.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        mangas,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Manga listesi hatası:", error);
    return NextResponse.json(
      { error: "Manga listesi alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
}