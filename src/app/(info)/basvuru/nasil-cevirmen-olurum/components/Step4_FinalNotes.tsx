"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Info } from "lucide-react";

// Teste Özel Notlar Componenti (Artık sadece bu dosyada kullanılıyor)
const TestNotes = () => (
    <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800 text-left">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" /><AlertTitle className="text-blue-800 dark:text-blue-300">Sayfalara Özel İpuçları</AlertTitle>
        <AlertDescription className="prose prose-sm dark:prose-invert"><ul className="list-disc pl-5 my-0"><li><strong>Sayfa 3:</strong> {`"g.o.d."`} = Genesis Omega Dragon olarak çevrilecektir.</li><li><strong>Sayfa 5:</strong> Erkek karakter, kuaföre gidip görünüşünü değiştiren kız arkadaşını tanıyamamakta ve hala onu beklediğini sanmaktadır.</li><li><strong>Sayfa 6:</strong> Kız kardeş, ablası ile çocuğun sevgili olduğunu düşünüp onları ayırmak için plan yapmaktadır.</li><li><strong>Sayfa 13:</strong> {`"Equus"`} kelimesini çevirmeniz beklenmektedir.</li></ul></AlertDescription>
    </Alert>
);

type Props = {
    finalNotesAccepted: boolean;
    setFinalNotesAccepted: (value: boolean) => void;
    onNext: () => void;
};

export function Step4FinalNotes({ finalNotesAccepted, setFinalNotesAccepted, onNext }: Props) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-black to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">Teste Başlamadan Önce Son Notlar</h1>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">Aşağıdaki ipuçları testte işini kolaylaştıracak. Test sırasında da bu notlara erişebileceksin.</p>
            <div className="mt-8 text-left"><TestNotes /></div>
            <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="final-notes-check" checked={finalNotesAccepted} onCheckedChange={(c) => setFinalNotesAccepted(Boolean(c))} />
                    <label htmlFor="final-notes-check" className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Teste özel notları okudum ve anladım.</label>
                </div>
                <Button onClick={onNext} disabled={!finalNotesAccepted} className="w-full md:w-auto text-lg py-7 px-8 bg-green-600 hover:bg-green-500 text-white rounded-full transition-transform duration-200 hover:scale-105 shadow-lg shadow-green-600/30">Artık Hazırım, Teste Başla!</Button>
            </div>
        </div>
    );
}