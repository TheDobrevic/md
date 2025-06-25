"use client";
import { Check } from "lucide-react";

type Props = { steps: string[]; currentStep: number };

export function MultiStepProgressBar({ steps, currentStep }: Props) {
  return (
    <div className="w-full">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
          return (
            <li key={step} className={`flex w-full items-center transition-colors duration-500 ${stepNumber < steps.length ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ""} ${isCompleted ? 'after:border-primary' : 'after:border-muted'}`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors duration-500 ${isActive ? 'bg-primary border-2 border-primary-foreground/50 ring-4 ring-primary/30' : isCompleted ? 'bg-primary' : 'bg-muted'} text-primary-foreground`}>
                {isCompleted ? <Check className="w-6 h-6" /> : <span className={`${isActive ? "" : "text-muted-foreground"}`}>{stepNumber}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className={`flex-1 text-center text-xs transition-colors duration-500 ${currentStep >= index + 1 ? "font-bold text-primary" : "text-muted-foreground"}`}>{step}</div>
        ))}
      </div>
    </div>
  );
}