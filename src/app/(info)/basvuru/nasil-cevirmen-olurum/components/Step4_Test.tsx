"use client";
import React from "react";
import MangaMagnifier from "@/components/ui/MangaMagnifier";
import { FormattingToolbar } from "@/components/ui/FormattingToolbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Check, Lightbulb } from "lucide-react";

type Props = {
  currentTestIndex: number;
  setCurrentTestIndex: (index: number) => void;
  totalPages: number;
  testPages: string[];
  formData: { mangaTest: string[] };
  textareaRef: React.Ref<HTMLTextAreaElement>;
  handleMangaTestChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  saveState: 'idle' | 'saving' | 'saved';
  handleAddPage: () => void;
  handleAddImageText: () => void;
  handleAddSfx: () => void;
  TestNotes: React.FC;
  onNext: () => void;
};

export function Step4Test({ currentTestIndex, setCurrentTestIndex, totalPages, testPages, formData, textareaRef, handleMangaTestChange, saveState, handleAddPage, handleAddImageText, handleAddSfx, TestNotes, onNext }: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-br from-black to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">Sıra Sende: Çeviri Testi</h1>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Dialog><DialogTrigger asChild><Button variant="outline" size="sm" className="bg-white/10 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-700 hover:text-white shrink-0"><Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />İpuçları</Button></DialogTrigger><DialogContent className="bg-neutral-900 border-neutral-700 text-white"><DialogHeader><DialogTitle>Sayfalara Özel İpuçları</DialogTitle></DialogHeader><div className="mt-4"><TestNotes /></div></DialogContent></Dialog>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Sayfa {currentTestIndex + 1} / {totalPages}</p>
        </div>
      </div>
      <Progress value={((currentTestIndex + 1) / totalPages) * 100} className="w-full mb-8 h-2" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="rounded-lg p-2 bg-neutral-800/50 border border-neutral-700 backdrop-blur-sm w-full">
          <MangaMagnifier src={testPages[currentTestIndex]} />
        </div>
        <div className="flex flex-col h-96 lg:h-[75vh]">
          <FormattingToolbar onAddPage={handleAddPage} onAddImageText={handleAddImageText} onAddSfx={handleAddSfx} />
          <div className="relative w-full flex-grow">
            <textarea ref={textareaRef} value={formData.mangaTest[currentTestIndex]} onChange={handleMangaTestChange} placeholder={`Sayfa ${currentTestIndex + 1} için çevirinizi buraya yazın...`} className="p-4 w-full h-full rounded-b-md border-x border-b border-neutral-700 bg-neutral-900/80 resize-y text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none" />
            <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-neutral-400 transition-opacity duration-300" style={{ opacity: saveState === 'idle' ? 0 : 1 }}>{saveState === 'saving' && <><Loader2 className="h-3 w-3 animate-spin" />Kaydediliyor...</>}{saveState === 'saved' && <><Check className="h-3 w-3 text-green-500" />Kaydedildi!</>}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-neutral-800">
        <Button variant="outline" className="bg-neutral-800/50 border-neutral-700" onClick={() => setCurrentTestIndex(currentTestIndex - 1)} disabled={currentTestIndex === 0}>Önceki Sayfa</Button>
        {currentTestIndex < totalPages - 1 ? (<Button className="bg-blue-600 hover:bg-blue-500 rounded-full" onClick={() => setCurrentTestIndex(currentTestIndex + 1)}>Sonraki Sayfa</Button>) : (<Button onClick={onNext} className="bg-green-600 hover:bg-green-500 rounded-full">Testi Bitir ve Bilgilerini Gir</Button>)}
      </div>
    </div>
  );
}