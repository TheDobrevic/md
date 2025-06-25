import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) throw new Error('Discord webhook URL ayarlanmamış.');
    
    const body = await request.json();
    const { name, email, nickname, mangaTest } = body;

    // mangaTest (string dizisi) verisini daha okunabilir bir metne çeviriyoruz.
    const formattedMangaTest = mangaTest
      .map((translation: string, index: number) => {
        const text = translation.trim() ? "```\n" + translation.substring(0, 250) + "\n```" : "> Boş Bırakıldı";
        return `**Sayfa ${index + 1}:**\n${text}`;
      })
      .join('\n\n');
    
    // Discord Embed'i hazırla. `description` kısmına tüm çevirileri basacağız.
    const discordMessage = {
      embeds: [
        {
          title: `📝 Yeni Çevirmen Başvurusu: ${nickname}`,
          color: 15158332, // Canlı bir pembe/mor tonu
          fields: [
            { name: "Ad Soyad", value: name, inline: true },
            { name: "E-posta", value: `||${email}||`, inline: true }, // E-postayı spoiler içine alarak gizlilik sağla
          ],
          description: `### Çeviri Testi Sonuçları\n\n${formattedMangaTest}`,
          footer: { text: `Başvuru Tarihi: ${new Date().toLocaleString('tr-TR')}` }
        }
      ]
    };

    // İsteği gönder
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage),
    });

    return NextResponse.json({ message: 'Başvuru başarıyla gönderildi.' });
  } catch (error: any) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}