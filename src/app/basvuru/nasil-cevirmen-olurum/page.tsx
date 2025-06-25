"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { AlertTriangle, Loader2, Send, CheckCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Sıfırdan yazdığımız, garantili component
import MangaMagnifier from "@/components/ui/MangaMagnifier"; 

const STEPS = { RULES: 1, READING_ORDER: 2, EXAMPLE: 3, MANGA_TEST: 4, USER_INFO: 5, RESULT: 6,};
const READING_ORDER_IMAGES = ["/reading-order/1.png", "/reading-order/2.png", "/reading-order/3.png", "/reading-order/4.png", "/reading-order/5.png",];
const MANGA_TEST_PAGES = [
    "/manga-test/page-01.jpg", "/manga-test/page-02.jpg", "/manga-test/page-03.jpg",
    "/manga-test/page-04.jpg", "/manga-test/page-05.jpg", "/manga-test/page-06.jpg",
    "/manga-test/page-07.jpg", "/manga-test/page-08.jpg", "/manga-test/page-09.jpg",
    "/manga-test/page-10.jpg", "/manga-test/page-11.jpg", "/manga-test/page-12.jpg",
    "/manga-test/page-13.jpg",
];


export default function OnsiteBasvuruGelistirilmisPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.RULES);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const [exampleAccepted, setExampleAccepted] = useState(false);

  const [formData, setFormData] = useState({
    mangaTest: Array(MANGA_TEST_PAGES.length).fill(""), name: "", email: "", nickname: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMangaTestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMangaTestData = [...formData.mangaTest];
    newMangaTestData[currentTestIndex] = e.target.value;
    setFormData((prev) => ({ ...prev, mangaTest: newMangaTestData }));
  };
   const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError("");
    try {
        const response = await fetch('/api/basvuru', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Sunucu hatası. Lütfen tekrar deneyin.');
        setCurrentStep(STEPS.RESULT);
    } catch (err) { // <-- BURASI DÜZELTİLDİ
        // Hatanın bir Error nesnesi olup olmadığını kontrol edip mesajını alıyoruz.
        const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <Card>
        {currentStep === STEPS.RULES && (
          <CardContent className="pt-6 space-y-6">
            <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>ÖNEMLİ BİLGİLENDİRME</AlertTitle><AlertDescription>Şu an için **Light Novel/Novel çevirmen alımımız yoktur.** Bu başvuru formu yalnızca Manga Çevirmenleri içindir.</AlertDescription></Alert>
            <div className="prose prose-sm dark:prose-invert max-w-none"><p>Çeviri yaparken dikkat etmeniz gerekenler:</p><ul className="list-decimal list-inside space-y-2"><li>Baloncuk atlanmadığından emin olun.</li><li>Uygun okuma sırasına göre çeviri yapın.</li><li>Sitemizdeki <Link href="/cevirmen-kilavuzu" target="_blank" className="text-primary underline">Çevirmen Kılavuzunu</Link> mutlaka okuyun.</li></ul></div>
            <div className="flex items-center space-x-2 pt-4 border-t"><Checkbox id="rules-check" checked={rulesAccepted} onCheckedChange={(c) => setRulesAccepted(Boolean(c))} /><label htmlFor="rules-check" className="text-sm font-medium">Kuralları okudum, anladım ve kabul ediyorum.</label></div>
            <Button onClick={() => setCurrentStep(STEPS.READING_ORDER)} disabled={!rulesAccepted} className="w-full">Sonraki Adım: Okuma Sırası</Button>
          </CardContent>
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
            <CardContent className="pt-6 space-y-6">
                <h3 className="text-xl font-semibold text-center">Adım 3: Örnek Çeviri</h3>
                 {/* BURADAKİ YAZI, HATAYI GİDERMEK İÇİN GÜNCELLENDİ */}
                 <p className="text-center text-sm text-muted-foreground">İyi bir çevirinin nasıl görünmesi gerektiğine dair bir örnek. <br/> Büyütmek için resmin üzerine gelin.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 w-full">
                         <MangaMagnifier src="/manga-test/ornek-sayfa.jpg" />
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/50 text-sm h-full"><pre className="whitespace-pre-wrap font-sans">{`1- Hey, nereye gittiğini sanıyorsun?\n\n2- Bekle!\n\n3- Peşinden gitmeliyiz...\n(Orijinal: We must go after him)\n\n4- Bu onun son şansı olabilirdi.`}</pre></div>
                </div>
                 <div className="flex items-center space-x-2 pt-4 border-t"><Checkbox id="example-check" checked={exampleAccepted} onCheckedChange={(c) => setExampleAccepted(Boolean(c))} /><label htmlFor="example-check" className="text-sm font-medium">Örneği inceledim, artık teste hazırım.</label></div>
                <Button onClick={() => setCurrentStep(STEPS.MANGA_TEST)} disabled={!exampleAccepted} className="w-full">Çeviri Testine Başla!</Button>
            </CardContent>
        )}
        
        {currentStep === STEPS.MANGA_TEST && (
             <CardContent className="pt-6 space-y-4">
                 <h3 className="text-xl font-semibold text-center">Çeviri Testi - Sayfa {currentTestIndex + 1} / {MANGA_TEST_PAGES.length}</h3>
                <Progress value={((currentTestIndex + 1) / MANGA_TEST_PAGES.length) * 100} className="w-full" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 w-full">
                         <MangaMagnifier src={MANGA_TEST_PAGES[currentTestIndex]} />
                    </div>
                     <textarea
                        value={formData.mangaTest[currentTestIndex]}
                        onChange={handleMangaTestChange}
                        placeholder={`Sayfa ${currentTestIndex + 1} için çevirinizi buraya yazın...`} 
                        className="p-4 w-full h-96 lg:h-[70vh] rounded-md border bg-background resize-y text-sm focus-visible:ring-2 focus-visible:ring-primary"
                    />
                </div>
                 <div className="flex justify-between items-center pt-4 border-t">
                     <Button variant="outline" onClick={() => setCurrentTestIndex(prev => prev - 1)} disabled={currentTestIndex === 0}>Önceki Sayfa</Button>
                     {currentTestIndex < MANGA_TEST_PAGES.length - 1 ? (
                         <Button onClick={() => setCurrentTestIndex(prev => prev + 1)}>Sonraki Sayfa</Button>
                     ) : (
                        <Button onClick={() => setCurrentStep(STEPS.USER_INFO)} className="bg-green-600 hover:bg-green-700">Testi Bitir ve Bilgilerini Gir</Button>
                     )}
                </div>
            </CardContent>
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