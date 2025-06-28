"use client";
import { Check } from "lucide-react";
import { clsx } from "clsx"; // clsx'i yüklemen gerekebilir: npm install clsx

type Props = {
  steps: string[];
  currentStep: number;
};

export function MultiStepProgressBar({ steps, currentStep }: Props) {
  const progressPercentage =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="w-full font-sans">
      <div className="relative flex justify-between items-center w-full">
        {/* Raylar güncellendi */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-slate-700/50 rounded-full"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gunbatimi-gradyani from-blue-500 to-orange-400 rounded-full transition-all duration-500 ease-in-out"
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
                "z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-in-out",
                {
                  // DEĞİŞİKLİK: Siyan/Mor yerine Mavi/Turuncu gradyanı
                  "bg-gunbatimi-gradyani from-blue-500 to-orange-500 text-white shadow-[0_0_10px_rgba(251,146,60,0.5)]":
                    isCompleted,
                  // DEĞİŞİKLİK: Vurgu rengi Turuncu oldu
                  "bg-slate-900 border-2 border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(251,146,60,0.7)] scale-110":
                    isActive,
                  // DEĞİŞİKLİK: Nötr renkler Slate oldu
                  "bg-slate-800 border-2 border-slate-700 text-slate-500":
                    !isCompleted && !isActive,
                }
              )}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-semibold">{stepNumber}</span>}
            </div>
          );
        })}
      </div>
      
      {/* Etiketler güncellendi */}
      <div className="flex justify-between mt-3">
        {steps.map((step, index) => {
            const isActiveOrCompleted = currentStep >= index + 1;
            return (
                <div key={index} /* ... */ 
                 className={clsx("...", { "text-white": isActiveOrCompleted, "text-slate-500": !isActiveOrCompleted, })} >
                    {step}
                </div>
            )
        })}
      </div>
    </div>
  );
}