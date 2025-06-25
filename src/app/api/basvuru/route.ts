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

    // 1. mangaTest dizisindeki her bir çeviriyi bir Discord "alanı" (field) objesine dönüştür.
    const testFields = mangaTest.map((translation: string, index: number) => {
        // Değer 1024 karakteri geçemez. Güvenlik için kısaltma ekleyelim.
        const value = translation.trim() 
            ? "```\n" + translation.substring(0, 1000) + "\n```" 
            : "> Boş Bırakıldı";

        return {
            name: `Sayfa ${index + 1}`, // Alanın başlığı (örn: "Sayfa 1")
            value: value,                 // Alanın içeriği (çeviri veya boş bırakıldı notu)
            inline: true                  // Alanların yan yana sığmasını sağlar, daha şık durur.
        };
    });

    // 2. Ana embed mesajını, bu yeni "alanlar" ile oluştur.
    const discordMessage = {
      embeds: [
        {
          title: `📝 Yeni Çevirmen Başvurusu: ${nickname}`,
          color: 15158332, // Canlı bir pembe/mor
          // Açıklama alanını artık sadece bir başlık için kullanıyoruz.
          description: "Lütfen aşağıdaki çeviri testi sonuçlarını inceleyin.",
          // fields array'ini temel bilgilerle başlatıp, test sonuçlarını sonuna ekliyoruz.
          fields: [
            { name: "Ad Soyad", value: name, inline: true },
            { name: "E-posta", value: `||${email}||`, inline: true },
            // Araya boş bir alan ekleyerek görsel ayrım sağlayalım.
            { name: '\u200B', value: '\u200B' }, 
            ...testFields // testFields dizisindeki tüm objeleri buraya yayıyoruz.
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
        // Discord'dan gelen hatayı daha detaylı loglamak için
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