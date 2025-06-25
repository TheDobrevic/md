"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Loader2, Send, CheckCircle, Info, Lightbulb } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Sıfırdan yazdığımız, garantili component
import MangaMagnifier from "@/components/ui/MangaMagnifier"; 

const STEPS = { 
  RULES: 1, 
  READING_ORDER: 2, 
  EXAMPLE: 3, 
  FINAL_NOTES: 4, 
  MANGA_TEST: 5, 
  USER_INFO: 6, 
  RESULT: 7,
};

const READING_ORDER_IMAGES = ["/reading-order/1.png", "/reading-order/2.png", "/reading-order/3.png", "/reading-order/4.png", "/reading-order/5.png"];
const MANGA_TEST_PAGES = [
    "/manga-test/page-01.jpg", "/manga-test/page-02.jpg", "/manga-test/page-03.jpg",
    "/manga-test/page-04.jpg", "/manga-test/page-05.jpg", "/manga-test/page-06.jpg",
    "/manga-test/page-07.jpg", "/manga-test/page-08.jpg", "/manga-test/page-09.jpg",
    "/manga-test/page-10.jpg", "/manga-test/page-11.jpg", "/manga-test/page-12.jpg",
    "/manga-test/page-13.jpg",
];

const TestNotes = () => (
    <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Sayfalara Özel İpuçları</AlertTitle>
        <AlertDescription className="prose prose-sm dark:prose-invert">
            <ul className="list-disc pl-5 my-0">
                <li><strong>Sayfa 3:</strong> "g.o.d." = Genesis Omega Dragon olarak çevrilecektir.</li>
                <li><strong>Sayfa 5:</strong> Erkek karakter, kuaföre gidip görünüşünü değiştiren kız arkadaşını tanıyamamakta ve hala onu beklediğini sanmaktadır.</li>
                <li><strong>Sayfa 6:</strong> Kız kardeş, ablası ile çocuğun sevgili olduğunu düşünüp onları ayırmak için plan yapmaktadır.</li>
                <li><strong>Sayfa 13:</strong> "Equus" kelimesini çevirmeniz beklenmektedir.</li>
            </ul>
        </AlertDescription>
    </Alert>
);

export default function OnsiteBasvuruGelistirilmisPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.RULES);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const [exampleAccepted, setExampleAccepted] = useState(false);
  const [finalNotesAccepted, setFinalNotesAccepted] = useState(false);
  const [formData, setFormData] = useState({mangaTest: Array(MANGA_TEST_PAGES.length).fill(""), name: "", email: "", nickname: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMangaTestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const newMangaTestData = [...formData.mangaTest]; newMangaTestData[currentTestIndex] = e.target.value; setFormData((prev) => ({ ...prev, mangaTest: newMangaTestData })); };
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); setError(""); try { const response = await fetch('/api/basvuru', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), }); if (!response.ok) throw new Error('Sunucu hatası. Lütfen tekrar deneyin.'); setCurrentStep(STEPS.RESULT); } catch (err) { const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.'; setError(errorMessage); } finally { setIsLoading(false); } };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <Card>
        {currentStep === STEPS.RULES && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Çevirmen Başvuru Testine Hoş Geldin!</CardTitle>
              <CardDescription>Başlamadan önce, kaliteli çeviriler için belirlediğimiz bazı temel ilkeleri okumanı rica ediyoruz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Önemli Bilgilendirme</AlertTitle><AlertDescription>Şu an için **Light Novel/Novel çevirmen alımımız yoktur.** Bu başvuru formu yalnızca Manga Çevirmenleri içindir.</AlertDescription></Alert>
              <Alert><Info className="h-4 w-4" /><AlertTitle>Testin Kaynağı ve Orijinallik</AlertTitle><AlertDescription>Kullanılan test sayfaları VIZ (Resmî Çeviri) kaynaklıdır. Lütfen başka sitelerden veya sitemizden kopya çekerek çeviri yapmayın. Emeğinize ve orijinalliğe önem veriyoruz.</AlertDescription></Alert>
              <div>
                <h3 className="mb-4 text-lg font-medium">Çeviride Başarı İçin "Olmazsa Olmazlar":</h3>
                <ol className="space-y-3">
                  {["Baloncuk atlanmadığından emin olun.", "Uygun okuma sırasına göre çeviri yapın.", "Editöre kolaylık olması için, karıştırılabilecek yerlerde İngilizcesini parantez içinde belirtin.", "Sayfadaki her İngilizce metni çevirdiğinizden emin olun.", "Ses ve özel efektleri (SFX) Türkçe'ye uyarlayın.", "Mümkün olan her yerde arı ve anlaşılır bir Türkçe kullanmaya özen gösterin.", "Türkçe'de tam karşılığı olmayan kelimeler için (Ç/N: Açıklama) formatında çevirmen notu ekleyin.", "Noktalama işaretlerini doğru ve yerinde kullanın.", "Cümle bitiminden sonra bir boşluk bırakın (Örn: `Bitti. Şimdi uza!`).", "Konuşma baloncukları arasında bir satır boşluk bırakın.", "`Whoa`, `Ouch` gibi nidaları `Oha`, `Ahhh` gibi Türkçe karşılıkları ile çevirin.", "Teknik terimler veya kültürel referanslar için (Ç/N) ile açıklama yapın.", <span key="kılavuz">Ve en önemlisi, sitemizdeki <Link href="/cevirmen-kilavuzu" target="_blank" className="font-bold text-primary underline hover:text-primary/80">Çevirmen Kılavuzu'nu</Link> mutlaka okuyun.</span> ].map((rule, index) => (
                    <li key={index} className="flex items-start"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground mr-3">{index + 1}</span><span className="flex-1 text-sm text-muted-foreground">{rule}</span></li>
                  ))}
                </ol>
              </div>
              <div className="flex items-center space-x-2 pt-6 border-t"><Checkbox id="rules-check" checked={rulesAccepted} onCheckedChange={(c) => setRulesAccepted(Boolean(c))} /><label htmlFor="rules-check" className="text-sm font-medium">Yukarıdaki tüm ilkeleri ve uyarıları okudum, anladım.</label></div>
              <Button onClick={() => setCurrentStep(STEPS.READING_ORDER)} disabled={!rulesAccepted} className="w-full text-lg py-6">Anladım, Sonraki Adıma Geç</Button>
            </CardContent>
          </>
        )}
        
        {currentStep === STEPS.READING_ORDER && (
            <CardContent className="pt-6 space-y-6">
                <h3 className="text-xl font-semibold text-center">Adım 2: Manga Okuma Sırası</h3>
                <Carousel className="w-full max-w-lg mx-auto" opts={{ loop: true }}><CarouselContent>{READING_ORDER_IMAGES.map((src, index) => ( <CarouselItem key={index}> <div className="p-1"> <AspectRatio ratio={9/16}><Image src={src} alt={`Okuma Sırası Örnek ${index + 1}`} fill className="rounded-md object-contain"/> </AspectRatio> </div></CarouselItem>))}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>
                <div className="flex items-center space-x-2 pt-4 border-t"><Checkbox id="order-check" checked={orderAccepted} onCheckedChange={(c) => setOrderAccepted(Boolean(c))} /><label htmlFor="order-check" className="text-sm font-medium">Okuma sırası örneklerini inceledim ve anladım.</label></div>
                <Button onClick={() => setCurrentStep(STEPS.EXAMPLE)} disabled={!orderAccepted} className="w-full">Sonraki Adım: Örnek Çeviri</Button>
            </CardContent>
        )}

        {currentStep === STEPS.EXAMPLE && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Uygulamalı Örnek ve Test İpuçları</CardTitle>
              <CardDescription>Solda örnek sayfayı, sağda ise test ipuçları ve referans almanı istediğimiz çeviri formatını görebilirsin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                <div className="lg:sticky lg:top-8 w-full">
                  <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-900"><MangaMagnifier src="/manga-test/ornek-sayfa.jpg" /></div>
                </div>
                <div className="w-full space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Bilgilendirme ve Teste Özel Notlar</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                      <div><h4 className="font-semibold mt-0">Genel Format Açıklamaları</h4><dl className="mt-2 space-y-2 text-xs"><div className="flex"><dt className="w-1/3 font-semibold shrink-0">Kaynak/Bölüm Adı:</dt><dd className="text-muted-foreground">Normalde belirtilir, bu test için gerekli değildir.</dd></div></dl></div>
                      <div><h4 className="font-semibold mt-0">Kapak Sayfası</h4><dl className="mt-2 space-y-2 text-xs"><div className="flex"><dt className="w-1/3 font-semibold shrink-0">Çeviri/Düzenleme:</dt><dd className="text-muted-foreground">İlgili kişilerin Nick'leri yazılır.</dd></div></dl></div>
                    </div>
                  </div>
                  <div className="border rounded-lg">
                    <div className="p-4 border-b"><h3 className="font-semibold text-lg">Referans Çeviri Metni Formatı</h3></div>
                    <div className="bg-muted/30 p-4 max-h-80 overflow-y-auto"><pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">{`||||||||||||||||||||||||[  KAPAK SAYFASI  ]||||||||||||||||||||||||

Çeviri		: Kullanacağınız Nick
Düzenleme		: Editörünüz
Temizleme		: Varsa temizleyici
Bölüm Adı		: Bölümün adı
Bölüm Sayısı	: Bölüm Numarası
Kaynak		: Çeviri Kaynağı Linki

|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SAYFA 01 >>>>>>>>>>>>>>>>>>>>>>>>>>>>

Oylayalım o hâlde.

Birinci sınıf Sasaki'nin "Maske Operasyonu".

Q takımında olmayan, 1. seviye ve üstü olanlar; eğer planı onaylıyorsanız elinizi kaldırın.

Kijima Takımı - Takım Lideri
Shiki Kijima
[Ortak Özel Sınıf Dedektif]
Onay

Bence plan muhteşem.

Neden daha önce bahsi geçmedi ki?

Kijima Takımı
Furuta
Nimura
[1. Seviye]

Eğer Bay Kajima onaylıyorsa...

Neyse, ben de onaylamalıyım.

Onay

Takım Lideri
Nobu
Shimoguchi
[Birinci Sınıf]
Ret

...

Biz de reddetmek zorunda mıyız?..

Miho Toga
[1. Seviye]
Ret

Eğer o reddediyorsa...

Shimoguchi Takımı

Yardımcı Takım Lideri
Shion Satomi
[1. Sınıf]
Ret

Onay
Ah.

S1 Takımı - Yardımcı Takım Lideri
Hairu Ihei
[Birinci Sınıf]

<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SAYFA 02 >>>>>>>>>>>>>>>>>>>>>>>>>>>>

`}</pre></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-6 border-t mt-6"><Checkbox id="example-check" checked={exampleAccepted} onCheckedChange={(c) => setExampleAccepted(Boolean(c))} /><label htmlFor="example-check" className="text-sm font-medium">Tüm ipuçlarını ve örnek formatı anladığımı onaylıyorum.</label></div>
              <Button onClick={() => setCurrentStep(STEPS.FINAL_NOTES)} disabled={!exampleAccepted} className="w-full text-lg py-6">Son Notlara İlerle</Button>
            </CardContent>
          </>
        )}
        
        {currentStep === STEPS.FINAL_NOTES && (
          <>
            <CardHeader><CardTitle className="text-2xl">Teste Başlamadan Önce Son İpuçları</CardTitle><CardDescription>Aşağıdaki notlar, testin belirli sayfalarında işini kolaylaştıracaktır. Lütfen dikkatlice oku.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <TestNotes />
                <div className="flex items-center space-x-2 pt-6 border-t"><Checkbox id="final-notes-check" checked={finalNotesAccepted} onCheckedChange={(c) => setFinalNotesAccepted(Boolean(c))} /><label htmlFor="final-notes-check" className="text-sm font-medium">Teste özel notları okudum ve anladım.</label></div>
                 <Button onClick={() => setCurrentStep(STEPS.MANGA_TEST)} disabled={!finalNotesAccepted} className="w-full text-lg py-6 bg-green-600 hover:bg-green-700">Artık Hazırım, Teste Başla!</Button>
            </CardContent>
          </>
        )}
        
        {currentStep === STEPS.MANGA_TEST && (
            <>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle className="text-2xl">Sıra Sende: Çeviri Testi</CardTitle><CardDescription>Test {MANGA_TEST_PAGES.length} sayfadan oluşmaktadır. Bol şans!</CardDescription></div>
                    <Dialog><DialogTrigger asChild><Button variant="outline" size="sm" className="ml-auto"><Lightbulb className="mr-2 h-4 w-4"/> İpuçlarını Gör</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Sayfalara Özel İpuçları</DialogTitle></DialogHeader><div className="mt-4"><TestNotes/></div></DialogContent></Dialog>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                     <div className="flex items-center gap-4 mb-4"><span className="text-sm font-bold text-muted-foreground">İlerleme: Sayfa {currentTestIndex + 1} / {MANGA_TEST_PAGES.length}</span><Progress value={((currentTestIndex + 1) / MANGA_TEST_PAGES.length) * 100} className="w-full" /></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 w-full"><MangaMagnifier src={MANGA_TEST_PAGES[currentTestIndex]} /></div>
                        <textarea value={formData.mangaTest[currentTestIndex]} onChange={handleMangaTestChange} placeholder={`Sayfa ${currentTestIndex + 1} için çevirinizi, okuma sırasına ve kurallara dikkat ederek buraya yazın...`} className="p-4 w-full h-96 lg:h-[70vh] rounded-md border bg-background resize-y text-sm focus-visible:ring-2 focus-visible:ring-primary"/>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t">
                        <Button variant="outline" onClick={() => setCurrentTestIndex(prev => prev - 1)} disabled={currentTestIndex === 0}>Önceki Sayfa</Button>
                        {currentTestIndex < MANGA_TEST_PAGES.length - 1 ? (<Button onClick={() => setCurrentTestIndex(prev => prev + 1)}>Sonraki Sayfa</Button>) : (<Button onClick={() => setCurrentStep(STEPS.USER_INFO)} className="bg-green-600 hover:bg-green-700">Testi Bitir ve Bilgilerini Gir</Button>)}
                    </div>
                </CardContent>
            </>
        )}
        
        {currentStep === STEPS.USER_INFO && ( 
            <form onSubmit={handleSubmit}>
                <CardHeader><CardTitle>Son Adım: Kişisel Bilgiler</CardTitle><CardDescription>Size ulaşabilmemiz ve sizi tanıyabilmemiz için bu bilgileri doldurun.</CardDescription></CardHeader>
                <CardContent className="space-y-4"><Input name="name" placeholder="Adınız Soyadınız" value={formData.name} onChange={handleUserInfoChange} required /><Input name="email" type="email" placeholder="E-posta Adresiniz" value={formData.email} onChange={handleUserInfoChange} required /><Input name="nickname" placeholder="Kullanacağınız Nick" value={formData.nickname} onChange={handleUserInfoChange} required />
                    {error && (<Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Hata</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-animate-spin" /> Gönderiliyor...</>) : (<><Send className="mr-2 h-4 w-4" /> Başvuruyu Gönder</>)}</Button>
                </CardContent>
            </form>
        )}

        {currentStep === STEPS.RESULT && ( 
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4"><CheckCircle className="h-20 w-20 text-green-500" /><h2 className="text-3xl font-bold tracking-tight">Başvurunuz Alındı!</h2><p className="text-muted-foreground max-w-sm">Ekibimize gösterdiğiniz ilgi için çok teşekkür ederiz. Başvurunuz en kısa sürede incelenip, belirttiğiniz e-posta adresinden size geri dönüş yapılacaktır.</p><Button asChild><Link href="/">Anasayfaya Dön</Link></Button></div>
            </CardContent>
        )}
      </Card>
    </div>
  );
}