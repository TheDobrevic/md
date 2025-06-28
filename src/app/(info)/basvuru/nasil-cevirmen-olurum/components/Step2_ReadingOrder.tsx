"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowRight } from "lucide-react";

type Props = { images: string[]; orderAccepted: boolean; setOrderAccepted: (value: boolean) => void; onNext: () => void; };

export function Step2ReadingOrder({ images, orderAccepted, setOrderAccepted, onNext }: Props) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-black to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">Manga Okuma Yönü</h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">Bildiğin gibi, manga sağdan sola okunur. Aşağıdaki animasyonlu örnekleri incele.</p>
      <Card className="mt-8 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 backdrop-blur-sm"><CardContent className="pt-6"><Carousel className="w-full max-w-md mx-auto" opts={{ loop: true }}><CarouselContent>{images.map((src, index) => (<CarouselItem key={index}><div className="p-1"><AspectRatio ratio={9 / 16}><Image src={src} alt={`Okuma Sırası Örnek ${index + 1}`} fill className="rounded-md" /></AspectRatio></div></CarouselItem>))}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel></CardContent></Card>
      <div className="mt-8 flex items-center justify-center space-x-2 "><Checkbox id="order-check" checked={orderAccepted} onCheckedChange={(c) => setOrderAccepted(Boolean(c))} /><label htmlFor="order-check" className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Okuma yönlerini anladım.</label></div>
      <Button onClick={onNext} disabled={!orderAccepted} className="mt-4 w-full md:w-auto text-lg py-7 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-transform duration-200 hover:scale-105 shadow-lg shadow-blue-600/30">Örnek Formata Geçelim<ArrowRight className="ml-2 h-5 w-5" /></Button>
    </div>
  );
}