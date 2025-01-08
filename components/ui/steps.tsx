'use client';

import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 w-full h-0.5 bg-gray-200">
        <div
          className="absolute h-full bg-primary transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <ul className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;

          return (
            <li key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-gray-300 bg-background',
                )}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={cn(
                  'mt-2 text-sm font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
