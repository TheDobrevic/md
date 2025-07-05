// lib/fileUtils.ts
import fs from 'fs';
import path from 'path';

export class MangaFileManager {
  private static baseDir = path.join(process.cwd(), 'public', 'mangas');

  /**
   * Manga için temel dizin yapısını oluşturur
   */
  static async createMangaStructure(mangaSlug: string) {
    const mangaPath = path.join(this.baseDir, mangaSlug);
    
    try {
      // Ana manga klasörünü oluştur
      if (!fs.existsSync(mangaPath)) {
        fs.mkdirSync(mangaPath, { recursive: true });
      }
      
      // Kapak resmi klasörünü oluştur
      const coverPath = path.join(mangaPath, 'cover');
      if (!fs.existsSync(coverPath)) {
        fs.mkdirSync(coverPath, { recursive: true });
      }
      
      return {
        success: true,
        mangaPath,
        coverPath,
        message: `Manga dizini başarıyla oluşturuldu: ${mangaPath}`
      };
    } catch (error) {
      console.error('Manga dizini oluşturulurken hata:', error);
      return {
        success: false,
        error: 'Manga dizini oluşturulamadı',
        details: error
      };
    }
  }

  /**
   * Manga slug'ını temizler (URL-friendly yapar)
   */
  static createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Özel karakterleri kaldır
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .trim(); // Başındaki ve sonundaki boşlukları kaldır
  }

  /**
   * Manga dizin yapısının mevcut olup olmadığını kontrol eder
   */
  static checkMangaExists(mangaSlug: string): boolean {
    const mangaPath = path.join(this.baseDir, mangaSlug);
    return fs.existsSync(mangaPath);
  }
}