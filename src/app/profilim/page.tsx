// app/giris/page.tsx

import { Suspense } from 'react';
import GirisFormu from '@/components/giris-formu';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ÇÖZÜM ADIM 1: Build işlemine en baştan sayfanın statik olmayacağını,
// her zaman dinamik olarak ele alınması gerektiğini söylüyoruz.
export const dynamic = 'force-dynamic';

export default function GirisSayfasi() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
      {/* 
        ÇÖZÜM ADIM 2: 'useSearchParams' hook'unu kullanan bileşenin etrafında
        doğru sınırı oluşturarak React'in render kurallarına uyuyoruz.
        Fallback, dinamik bileşen yüklenirken gösterilecek olan yedek arayüzdür.
      */}
      <Suspense fallback={<GirisSayfasiSkeleton />}>
        <GirisFormu />
      </Suspense>
    </div>
  );
}

// Yükleme sırasında gösterilecek olan yedek component.
function GirisSayfasiSkeleton() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}