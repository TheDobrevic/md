// components/ui/MultiStepProgressBar.tsx

"use client";
import { Check } from "lucide-react";
import { clsx } from "clsx"; // clsx yüklü olduğundan emin ol: npm install clsx

type Props = {
  steps: string[];
  currentStep: number;
};

export function MultiStepProgressBar({ steps, currentStep }: Props) {
  const progressPercentage =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

  // Başarı gradyanı için değişkenler (light ve dark mod için ayrı)
  const completeGradientLight = "from-blue-600 to-orange-500";
  const completeGradientDark = "from-blue-500 to-orange-400"; // Daha az yoğun bir karanlık mod gradyanı

  // Aktif adımın vurgu rengi
  const activeBorderLight = "border-orange-500";
  const activeBorderDark = "border-orange-400";

  // Aktif adımın metin rengi
  const activeTextLight = "text-orange-600";
  const activeTextDark = "text-orange-300";

  return (
    <div className="w-full font-pixelify"> {/* font-pixelify geri alındı */}
      <div className="relative flex justify-between items-center w-full">
        {/* Raylar: Zemin rayı */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        {/* Raylar: İlerleme rayı (gradyan ve temaya duyarlı) */}
        <div
          className={clsx(
            "absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-br rounded-full transition-all duration-500 ease-in-out",
            completeGradientLight, // Light mod için varsayılan gradyan
            `dark:${completeGradientDark}` // Dark mod için gradyan
          )}
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div
              key={step}
              className={clsx(
                "z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-in-out text-sm font-semibold",
                {
                  // TAMAMLANMIŞ ADIM: Gradyan arka plan, beyaz metin, vurgulu gölge
                  "bg-gradient-to-br text-white shadow-lg": isCompleted,
                  // Gradaşı temaya duyarlı hale getir
                  [`${completeGradientLight} dark:${completeGradientDark}`]: isCompleted,
                  "shadow-blue-500/30 dark:shadow-blue-700/50": isCompleted, // Gölgeleri temaya uyumlu yaptık

                  // AKTİF ADIM: Kenarlık, metin rengi vurgulu, daha büyük gölge
                  "border-2 scale-110": isActive,
                  "bg-white dark:bg-neutral-800": isActive, // İç arka planı da temaya uyumlu
                  [`${activeBorderLight} dark:${activeBorderDark}`]: isActive, // Kenarlık rengi temaya duyarlı
                  [`${activeTextLight} dark:${activeTextDark}`]: isActive, // Metin rengi temaya duyarlı
                  "shadow-xl shadow-orange-500/40 dark:shadow-orange-700/60": isActive, // Gölgeleri temaya uyumlu yaptık

                  // HENÜZ YAPILMAMIŞ ADIM: Nötr renkler
                  "bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400": !isCompleted && !isActive,
                }
              )}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : <span>{stepNumber}</span>}
            </div>
          );
        })}
      </div>
      
      {/* Etiketler: Metin renkleri temaya duyarlı */}
      <div className="flex justify-between mt-3 px-1 md:px-0 text-xs md:text-sm"> {/* Boyutlandırmayı biraz iyileştirdik */}
        {steps.map((step, index) => {
            const isActiveOrCompleted = currentStep >= index + 1;
            const textClass = isActiveOrCompleted
                ? clsx("text-neutral-900", activeTextLight, `dark:${activeTextDark}`) // Tamamlanmış ve aktif adımların etiket metinleri
                : "text-gray-500 dark:text-gray-400"; // Pasif adımların etiket metinleri

            return (
                <div key={index} className={clsx("text-center flex-1 mx-0.5", textClass)} style={{ transition: 'color 0.3s ease-in-out' }}>
                    {step}
                </div>
            );
        })}
      </div>
    </div>
  );
}