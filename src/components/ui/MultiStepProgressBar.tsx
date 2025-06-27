"use client";
import { Check } from "lucide-react";
import { clsx } from "clsx"; // clsx'i yüklemen gerekebilir: npm install clsx

type Props = {
  steps: string[];
  currentStep: number;
};

export function MultiStepProgressBar({ steps, currentStep }: Props) {
  // İlerleme çubuğunun yüzdesini hesapla. 
  // (steps.length - 1) çünkü 6 adım arasında 5 aralık vardır.
  const progressPercentage =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="w-full font-sans">
      {/* Adım Düğümleri ve İlerleme Rayı */}
      <div className="relative flex justify-between items-center w-full">
        {/* Arka Plan Rayı */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-neutral-700/50 rounded-full"></div>

        {/* Dolu İlerleme Rayı (Gradyan ve Animasyonlu) */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>

        {/* Adım Düğümleri (Noktalar) */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div
              key={step}
              className={clsx(
                "z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-in-out",
                {
                  "bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_10px_rgba(167,139,250,0.5)]":
                    isCompleted,
                  "bg-neutral-900 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.7)] scale-110":
                    isActive,
                  "bg-neutral-800 border-2 border-neutral-700 text-neutral-500":
                    !isCompleted && !isActive,
                }
              )}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{stepNumber}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Adım Etiketleri */}
      <div className="flex justify-between mt-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActiveOrCompleted = currentStep >= stepNumber;
          return (
            <div
              key={index}
              className={clsx(
                "flex-1 text-center text-xs sm:text-sm font-medium transition-all duration-500 ease-in-out",
                {
                  "text-white": isActiveOrCompleted,
                  "text-neutral-500": !isActiveOrCompleted,
                }
              )}
              // Etiketlerin tam olarak düğümlerin altına gelmesi için
              style={{
                width: `${100 / steps.length}%`,
              }}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}