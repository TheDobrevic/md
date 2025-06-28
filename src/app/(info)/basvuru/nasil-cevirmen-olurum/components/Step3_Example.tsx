"use client";
import MangaMagnifier from "@/components/ui/MangaMagnifier";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";

type Props = { exampleAccepted: boolean; setExampleAccepted: (value: boolean) => void; onNext: () => void; };

export function Step3Example({ exampleAccepted, setExampleAccepted, onNext }: Props) {
  return (
    <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10"><h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-black to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">Örnek Format ve Referanslar</h1><p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">İşte senden beklediğimiz çeviri formatı ve referans alabileceğin çeviri metni.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8 items-start">
            <div className="lg:sticky lg:top-16 w-full"><div className="rounded-lg p-2 bg-neutral-800/50 border border-neutral-700 backdrop-blur-sm"><MangaMagnifier src="/manga-test/ornek-sayfa.jpg" /></div></div>
            <div className="w-full space-y-6">
                <div className="border rounded-lg p-4 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 backdrop-blur-sm"><h3 className="font-semibold text-lg mb-2 text-neutral-800 dark:text-white">Genel Bilgilendirme</h3><div className="prose prose-sm dark:prose-invert max-w-none space-y-4"><div><h4 className="font-semibold mt-0">Genel Format</h4><dl className="mt-2 space-y-2 text-xs"><div className="flex"><dt className="w-1/3 font-semibold text-neutral-600 dark:text-neutral-300 shrink-0">Kaynak/Bölüm:</dt><dd className="text-neutral-500 dark:text-neutral-400">Normalde belirtilir, bu test için gerekli değildir.</dd></div></dl></div></div></div>
                <div className="border rounded-lg bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 backdrop-blur-sm"><div className="p-4 border-b border-neutral-200 dark:border-neutral-700"><h3 className="font-semibold text-lg text-neutral-800 dark:text-white">Referans Çeviri Metni</h3></div><div className="p-4 max-h-[25rem] overflow-y-auto"><pre className="whitespace-pre-wrap font-mono text-xs text-neutral-500 dark:text-neutral-400">{`|||||||||||||||||[ KAPAK SAYFASI ]|||||||||||||||||\n\nÇeviri\t\t: Kullanacağınız Nick\nDüzenleme\t: Editörünüz\nTemizleme\t: Varsa temizleyici\nBölüm Adı\t: Bölümün adı\nBölüm Sayısı\t: Bölüm Numarası\nKaynak\t\t: Çeviri Kaynağı Linki\n\n|||||||||||||||||||||||||||||||||||||||||||||||||||\n\n<<<<<<<<<<<<<<< SAYFA 01 >>>>>>>>>>>>>>>>\n\nOylayalım o hâlde.\n\nBirinci sınıf Sasaki'nin "Maske Operasyonu".\n\n...\n`}</pre></div></div>
            </div>
        </div>
         <div className="mt-8 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2"><Checkbox id="example-check" checked={exampleAccepted} onCheckedChange={(c) => setExampleAccepted(Boolean(c))} /><label htmlFor="example-check" className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Tüm kuralları ve örnek formatı anladım.</label></div>
            <Button onClick={onNext} disabled={!exampleAccepted} className="w-full md:w-auto text-lg py-7 px-8 bg-green-600 hover:bg-green-500 text-white rounded-full transition-transform duration-200 hover:scale-105 shadow-lg shadow-green-600/30">Artık Hazırım, Teste Başla!<ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
    </div>
  );
}