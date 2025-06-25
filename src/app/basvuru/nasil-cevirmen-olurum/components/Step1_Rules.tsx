"use client";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";

type Props = { rulesAccepted: boolean; setRulesAccepted: (value: boolean) => void; onNext: () => void; };

export function Step1Rules({ rulesAccepted, setRulesAccepted, onNext }: Props) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-black to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">Çevirmen Başvuru Yolculuğu</h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">Ekibimize katılma yolundaki ilk adımlara hoş geldin! Aşağıdaki kuralları dikkatlice oku.</p>
      <div className="mt-8 space-y-4 text-left">
        <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Önemli Bilgilendirme</AlertTitle><AlertDescription>Şu an için **Light Novel/Novel çevirmen alımımız yoktur.** Bu başvuru formu yalnızca Manga Çevirmenleri içindir.</AlertDescription></Alert>
        <div className="p-6 rounded-lg bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 backdrop-blur-sm">
          {/* Hatanın olduğu "Olmazsa Olmazlar" bölümü güncellendi */}
          <h3 className="mb-4 text-lg font-medium text-neutral-800 dark:text-white text-center">{`Çeviride Başarı İçin "Olmazsa Olmazlar"`}</h3>
          <ol className="space-y-3 columns-1 md:columns-2">
            {[
              "Baloncuk atlanmadığından emin olun.", "Uygun okuma sırasına göre çeviri yapın.",
              "Editörün hangi baloncuğu editleyeceğini karıştırabileceği yerlerde kolaylık olsun diye parantez içinde İngilizcesi'nin de verildiğinden emin olun.",
              "İngilizce olan her şeyin çevirildiğinden emin olun.", "Ses efekti/Özel Efekt baloncuklarının çevrildiğinden emin olun.",
              "Mümkün olduğunca Türkçe kullanmaya özen gösterildiğinden emin olun.",
              "Yabancı kelime olarak verilmek zorunda kalan sözcüğün (Türkçe'de karşılığı veya tam karşılığı olmayan) Ç/N'sinin eklendiğinden emin olun, (Ç/N: Çevirmen Notudur).",
              "Noktalama işaretlerinin unutulmadığından emin olun.",
              <>Noktalama işareti sonrasında başlayacak cümleyle noktalama işareti arasına boşluk konulduğundan emin olun, (<code className="text-xs">{`("bitti. Şimdi uza!")`}</code> gibi).</>,
              "Konuşma baloncukları arasında bir satır boşluk bırakıldığından emin olun.",
              "Whoa, Ouch gibi kısımların çevrildiğinden emin olun, (Oha, Ahhh vb.).",
              "Terim anlamı olan veya çok sık Türkçe'de kullanılmayan bir kelimenin Ç/N'sinin eklendiğinden emin olun.",
              <span key="kılavuz">Sitemizdeki <Link href="/cevirmen-kilavuzu" target="_blank" className="font-bold text-blue-500 underline hover:text-blue-400">Çevirmen Kılavuzu'nu</Link> da çeviri öncesinde kesinlikle okuyun.</span>
            ]
            .map((rule, index) => (<li key={index} className="flex items-start text-sm"><Check className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0" /> <span className="flex-1 text-neutral-600 dark:text-neutral-400">{rule}</span> </li>))}
          </ol>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center space-x-2 "><Checkbox id="rules-check" checked={rulesAccepted} onCheckedChange={(c) => setRulesAccepted(Boolean(c))} /><label htmlFor="rules-check" className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Tüm ilkeleri ve uyarıları okudum, anladım.</label></div>
      <Button onClick={onNext} disabled={!rulesAccepted} className="mt-4 w-full md:w-auto text-lg py-7 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-transform duration-200 hover:scale-105 shadow-lg shadow-blue-600/30">Anladım, devam edelim <ArrowRight className="ml-2 h-5 w-5" /></Button>
    </div>
  );
}