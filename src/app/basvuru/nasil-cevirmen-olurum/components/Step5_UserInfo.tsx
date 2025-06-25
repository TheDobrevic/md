"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, AlertTriangle } from "lucide-react";

type Props = {
  formData: { name: string; email: string; nickname: string; };
  handleUserInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string;
};

export function Step5UserInfo({ formData, handleUserInfoChange, handleSubmit, isLoading, error }: Props) {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-black to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">Neredeyse Bitti!</h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">Son olarak, sana ulaşabilmemiz için iletişim bilgilerini paylaşman gerekiyor.</p>
      <form onSubmit={handleSubmit} className="mt-8 text-left">
        <Card className="bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-4">
              <Input name="name" placeholder="Adın ve Soyadın" value={formData.name} onChange={handleUserInfoChange} required className="bg-white/50 dark:bg-neutral-900/50 border-neutral-400 dark:border-neutral-700" />
              <Input name="email" type="email" placeholder="E-posta Adresin" value={formData.email} onChange={handleUserInfoChange} required className="bg-white/50 dark:bg-neutral-900/50 border-neutral-400 dark:border-neutral-700" />
              <Input name="nickname" placeholder="Sitede Kullanacağın Nick" value={formData.nickname} onChange={handleUserInfoChange} required className="bg-white/50 dark:bg-neutral-900/50 border-neutral-400 dark:border-neutral-700" />
              {error && (<Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Hata</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}
              <Button type="submit" className="w-full text-lg py-7" disabled={isLoading}>
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gönderiliyor...</>) : (<>Başvuruyu Tamamla ve Gönder<Send className="ml-2 h-4 w-4" /></>)}
              </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}