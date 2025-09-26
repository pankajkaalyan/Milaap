import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {stepIdx < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-amber-600" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-amber-600 rounded-full hover:bg-amber-700">
                  <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-gray-800 border-2 border-amber-600 rounded-full" aria-current="step">
                  <span className="h-2.5 w-2.5 bg-amber-600 rounded-full" aria-hidden="true" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-gray-800 border-2 border-gray-600 rounded-full group-hover:border-gray-400">
                  <span className="h-2.5 w-2.5 bg-transparent rounded-full" aria-hidden="true" />
                </div>
              </>
            )}
             <span className="absolute top-10 w-max -ml-2 text-xs font-semibold text-gray-300">{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;