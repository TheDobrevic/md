import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { auth } from '@/app/auth'; 
import { mangaCreateSchema } from '@/lib/validations/manga'; // Oluşturduğumuz Zod şeması

// Türkçe karakterleri de destekleyen daha gelişmiş bir slug oluşturma fonksiyonu
function createSlug(title: string): string {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return title.toString().toLowerCase()
      .replace(/\s+/g, '-') // Boşlukları - ile değiştir
      .replace(p, c => b.charAt(a.indexOf(c))) // Özel karakterleri dönüştür
      .replace(/&/g, '-ve-') // & karakterini '-ve-' ile değiştir
      .replace(/[^\w\-]+/g, '') // Kelime olmayan karakterleri kaldır
      .replace(/\-\-+/g, '-') // Birden fazla -- varsa tek - yap
      .replace(/^-+/, '') // Başlangıçtaki - karakterlerini kaldır
      .replace(/-+$/, '') // Sondaki - karakterlerini kaldır
}


// ----------- YENİ MANGA OLUŞTURMA (POST) -----------
export async function POST(req: Request) {
  try {
    // 1. Güvenlik: Kullanıcı oturumu ve rol kontrolü (Mevcut kodunuzdan alındı ve iyileştirildi)
    const session = await auth();
    const authorizedRoles = ['ADMIN', 'EDITOR', 'KURUCU'];
    
    if (!session?.user?.id || !session.user.role || !authorizedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Bu işlemi yapmak için yetkiniz yok." }, { status: 403 });
    }
    const userId = session.user.id;

    // 2. Gelen veriyi Zod ile güvenli bir şekilde doğrulama
    const body = await req.json();
    const validatedData = mangaCreateSchema.parse(body);

    // 3. Slug oluşturma ve başlık kontrolü
    const slug = validatedData.slug ? createSlug(validatedData.slug) : createSlug(validatedData.title);

    const existingManga = await prisma.manga.findFirst({
      where: { OR: [{ title: validatedData.title }, { slug: slug }] },
    });

    if (existingManga) {
      return NextResponse.json(
        { error: "Bu başlık veya URL ile zaten bir manga mevcut." },
        { status: 409 } // 409 Conflict daha uygun bir HTTP status kodudur
      );
    }
    
    // 4. Veritabanına yazma
    // Zod'dan gelen doğrulanmış veriyi doğrudan kullanıyoruz. Bu çok daha güvenli ve temiz.
    const newManga = await prisma.manga.create({
      data: {
        ...validatedData,
        releaseYear: validatedData.releaseYear ? Number(validatedData.releaseYear) : undefined,
        slug: slug, // Oluşturulan slug'ı ekle
        createdById: userId, // Güvenli bir şekilde oturumdan gelen kullanıcıyı ata
      },
    });

    return NextResponse.json(newManga, { status: 201 }); // 201 Created status kodu

  } catch (error) {
    // Zod validasyon hatası olursa, detaylı bilgi döndür
    if (error instanceof z.ZodError) {
      // Formda alan bazlı hata göstermeyi kolaylaştırır
      return NextResponse.json({ error: "Geçersiz form verisi.", details: error.flatten() }, { status: 422 }); // 422 Unprocessable Entity
    }
    
    // Genel sunucu hatası
    console.error("[MANGA_POST_ERROR]", error);
    return NextResponse.json({ error: "Dahili Sunucu Hatası" }, { status: 500 });
  }
}


// ----------- MANGALARI LİSTELEME (GET) -----------
// Bu kısım zaten iyi yapılandırılmıştı, olduğu gibi kullanabiliriz.
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const authorizedRoles = ['ADMIN', 'EDITOR', 'KURUCU'];
    
    if (!session?.user?.id || !session.user.role || !authorizedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Bu işlemi yapmak için yetkiniz yok." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { author: { contains: search, mode: 'insensitive' as const} }
      ]
    } : {};

    const [mangas, total] = await prisma.$transaction([
      prisma.manga.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, name: true } },
          _count: { select: { seasons: true } }
        }
      }),
      prisma.manga.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: mangas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Manga listeleme hatası:", error);
    return NextResponse.json(
      { error: "Mangalar listelenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}