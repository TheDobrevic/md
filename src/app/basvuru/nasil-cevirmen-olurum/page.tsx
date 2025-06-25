"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Child Component'leri ve UI Bileşenlerini import ediyoruz
import { MultiStepProgressBar } from "@/components/ui/MultiStepProgressBar";
import { Step1Rules } from "./components/Step1_Rules";
import { Step2ReadingOrder } from "./components/Step2_ReadingOrder";
import { Step3Example } from "./components/Step3_Example";
import { Step4Test } from "./components/Step4_Test";
import { Step5UserInfo } from "./components/Step5_UserInfo";
import { Step6Result } from "./components/Step6_Result";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// SABİTLER
const STEPS = { RULES: 1, READING_ORDER: 2, EXAMPLE: 3, MANGA_TEST: 4, USER_INFO: 5, RESULT: 6 };
const STEP_LABELS = ["Kurallar", "Okuma Yönü", "Örnek", "Test", "Bilgiler", "Sonuç"];
const READING_ORDER_IMAGES = [
  "/reading-order/1.png",
  "/reading-order/2.png",
  "/reading-order/3.png",
  "/reading-order/4.png",
  "/reading-order/5.png",
];
const MANGA_TEST_PAGES = [
  "/manga-test/page-01.jpg",
  "/manga-test/page-02.jpg",
  "/manga-test/page-03.jpg",
  "/manga-test/page-04.jpg",
  "/manga-test/page-05.jpg",
  "/manga-test/page-06.jpg",
  "/manga-test/page-07.jpg",
  "/manga-test/page-08.jpg",
  "/manga-test/page-09.jpg",
  "/manga-test/page-10.jpg",
  "/manga-test/page-11.jpg",
  "/manga-test/page-12.jpg",
  "/manga-test/page-13.jpg",
];

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const TestNotes = () => (
  <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800 text-left">
    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    <AlertTitle className="text-blue-800 dark:text-blue-300">Sayfalara Özel İpuçları</AlertTitle>
    <AlertDescription className="prose prose-sm dark:prose-invert">
      <ul className="list-disc pl-5 my-0">
        <li><strong>Sayfa 3:</strong> {`"g.o.d."`} = Genesis Omega Dragon olarak çevrilecektir.</li>
        <li><strong>Sayfa 5:</strong> Erkek karakter, kuaföre gidip görünüşünü değiştiren kız arkadaşını tanıyamamakta ve hala onu beklediğini sanmaktadır.</li>
        <li><strong>Sayfa 6:</strong> Kız kardeş, ablası ile çocuğun sevgili olduğunu düşünüp onları ayırmak için plan yapmaktadır.</li>
        <li><strong>Sayfa 13:</strong> {`"Equus"`} kelimesini çevirmeniz beklenmektedir.</li>
      </ul>
    </AlertDescription>
  </Alert>
);

export default function OnsiteBasvuruPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.RULES);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const [exampleAccepted, setExampleAccepted] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [formData, setFormData] = useState({ mangaTest: Array(MANGA_TEST_PAGES.length).fill(""), name: "", email: "", nickname: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleMangaTestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaveState('saving');
    const newData = [...formData.mangaTest];
    newData[currentTestIndex] = e.target.value;
    setFormData(prev => ({ ...prev, mangaTest: newData }));
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('/api/basvuru', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Sunucu hatası. Lütfen tekrar deneyin.');
      setCurrentStep(STEPS.RESULT);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const insertText = useCallback((textToInsert: string, cursorOffset: number) => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const current = formData.mangaTest[currentTestIndex] || "";
    const updated = current.slice(0, start) + textToInsert + current.slice(end);
    const newData = [...formData.mangaTest]; newData[currentTestIndex] = updated;
    setFormData(prev => ({ ...prev, mangaTest: newData }));
    requestAnimationFrame(() => {
      ta.focus(); ta.selectionStart = ta.selectionEnd = start + cursorOffset;
    });
  }, [currentTestIndex, formData.mangaTest]);

  const handleAddPage = useCallback(() => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    const pos = ta.selectionStart;
    const text = formData.mangaTest[currentTestIndex] || "";
    if (!text.trim()) {
      const marker = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SAYFA 01 >>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n`;
      const newData = [...formData.mangaTest]; newData[currentTestIndex] = marker;
      setFormData(prev => ({ ...prev, mangaTest: newData }));
      requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = marker.length; });
      return;
    }
    const regex = /<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SAYFA (\d+) >>>>>>>>>>>>>>>>>>>>>>>>>>>>/g;
    const markers = [...text.matchAll(regex)].map(m => ({ idx: m.index!, num: parseInt(m[1],10) }));
    let last = 0;
    for (const m of markers) if (m.idx < pos) last = m.num; else break;
    const next = last + 1;
    const newMarker = `\n\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SAYFA ${String(next).padStart(2,'0')} >>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n`;
    const following = text.slice(pos).replace(regex, (_, p1) => {
      const n = parseInt(p1,10)+1; return `<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SAYFA ${String(n).padStart(2,'0')} >>>>>>>>>>>>>>>>>>>>>>>>>>>>`;
    });
    const combined = text.slice(0,pos) + newMarker + following;
    const newData = [...formData.mangaTest]; newData[currentTestIndex] = combined;
    setFormData(prev => ({ ...prev, mangaTest: newData }));
    requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + newMarker.length; });
  }, [currentTestIndex, formData.mangaTest]);

  const handleAddImageText = useCallback(() => insertText("* ",2), [insertText]);
  const handleAddSfx = useCallback(() => insertText("[]",1), [insertText]);

  useEffect(() => {
    if (saveState === 'saving') { const t = setTimeout(() => setSaveState('saved'),800); return () => clearTimeout(t); }
    if (saveState === 'saved') { const t = setTimeout(() => setSaveState('idle'),1500); return () => clearTimeout(t); }
  }, [saveState]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white selection:bg-blue-500/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-neutral-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <main className="container mx-auto px-4 py-12 md:py-16">
        {currentStep !== STEPS.RESULT && (
          <div className="mx-auto max-w-4xl mb-16">
            <MultiStepProgressBar steps={STEP_LABELS} currentStep={currentStep} />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            {currentStep === STEPS.RULES && <Step1Rules rulesAccepted={rulesAccepted} setRulesAccepted={setRulesAccepted} onNext={() => setCurrentStep(STEPS.READING_ORDER)} />}
            {currentStep === STEPS.READING_ORDER && <Step2ReadingOrder images={READING_ORDER_IMAGES} orderAccepted={orderAccepted} setOrderAccepted={setOrderAccepted} onNext={() => setCurrentStep(STEPS.EXAMPLE)} />}
            {currentStep === STEPS.EXAMPLE && <Step3Example exampleAccepted={exampleAccepted} setExampleAccepted={setExampleAccepted} onNext={() => setCurrentStep(STEPS.MANGA_TEST)} />}
            {currentStep === STEPS.MANGA_TEST && <Step4Test TestNotes={TestNotes} currentTestIndex={currentTestIndex} setCurrentTestIndex={setCurrentTestIndex} totalPages={MANGA_TEST_PAGES.length} testPages={MANGA_TEST_PAGES} formData={formData} textareaRef={textareaRef} handleMangaTestChange={handleMangaTestChange} saveState={saveState} handleAddPage={handleAddPage} handleAddImageText={handleAddImageText} handleAddSfx={handleAddSfx} onNext={() => setCurrentStep(STEPS.USER_INFO)} />}
            {currentStep === STEPS.USER_INFO && <Step5UserInfo formData={formData} handleUserInfoChange={handleUserInfoChange} handleSubmit={handleSubmit} isLoading={isLoading} error={error} />}
            {currentStep === STEPS.RESULT && <Step6Result />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
