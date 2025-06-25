import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('Discord webhook URL ayarlanmamış.');
    }
    
    const body = await request.json();
    const { name, email, nickname, mangaTest } = body;

    const formattedMangaTest = mangaTest
      .map((translation: string, index: number) => {
        const text = translation.trim() ? "```\n" + translation.substring(0, 250) + "\n```" : "> Boş Bırakıldı";
        return `**Sayfa ${index + 1}:**\n${text}`;
      })
      .join('\n\n');
    
    const discordMessage = {
      embeds: [
        {
          title: `📝 Yeni Çevirmen Başvurusu: ${nickname}`,
          color: 15158332,
          fields: [
            { name: "Ad Soyad", value: name, inline: true },
            { name: "E-posta", value: `||${email}||`, inline: true },
          ],
          description: `### Çeviri Testi Sonuçları\n\n${formattedMangaTest}`,
          footer: { text: `Başvuru Tarihi: ${new Date().toLocaleString('tr-TR')}` }
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
        throw new Error(`Discord'a gönderilemedi. Status: ${response.status}`);
    }

    return NextResponse.json({ message: 'Başvuru başarıyla gönderildi.' });

  } catch (error) { // <-- BURASI DÜZELTİLDİ
    console.error("API Hatası:", error);
    // Hatanın bir Error nesnesi olup olmadığını kontrol edip mesajını alıyoruz.
    const errorMessage = error instanceof Error ? error.message : 'Bir sunucu hatası oluştu.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}