import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error('Discord webhook URL ayarlanmamış.');
    }
    
    const body = await request.json();
    const { name, email, nickname, mangaTest } = body;

    // --- DEĞİŞİKLİK BURADA BAŞLIYOR ---

    // 1. Gelen değerlerin boş olup olmadığını kontrol et ve varsayılan bir metin ata.
    const safeName = name?.trim() || '> Boş Bırakıldı';
    const safeNickname = nickname?.trim() || '> Bilinmiyor';
    const safeEmail = email?.trim() ? `||${email.trim()}||` : '> Boş Bırakıldı';

    // 2. mangaTest dizisindeki her bir çeviriyi bir Discord "alanı" (field) objesine dönüştür.
    const testFields = mangaTest.map((translation: string, index: number) => {
        const value = translation.trim() 
            ? "```\n" + translation.substring(0, 1000) + "\n```" 
            : "> Boş Bırakıldı";

        return {
            name: `Sayfa ${index + 1}`,
            value: value,
            inline: true
        };
    });

    // 3. Ana embed mesajını, bu yeni "güvenli" değerler ile oluştur.
    const discordMessage = {
      embeds: [
        {
          title: `📝 Yeni Çevirmen Başvurusu: ${safeNickname}`,
          color: 15158332,
          description: "Lütfen aşağıdaki çeviri testi sonuçlarını inceleyin.",
          fields: [
            { name: "Ad Soyad", value: safeName, inline: true },
            { name: "E-posta", value: safeEmail, inline: true },
            { name: '\u200B', value: '\u200B' }, 
            ...testFields
          ],
          footer: { text: `Başvuru Tarihi: ${new Date().toLocaleString('tr-TR')}` }
        }
      ]
    };
    // --- DEĞİŞİKLİK BURADA BİTİYOR ---

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Discord API Error:", errorBody);
        throw new Error(`Discord'a gönderilemedi. Status: ${response.status}`);
    }

    return NextResponse.json({ message: 'Başvuru başarıyla gönderildi.' });

  } catch (error) {
    console.error("API Hatası:", error);
    const errorMessage = error instanceof Error ? error.message : 'Bir sunucu hatası oluştu.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}