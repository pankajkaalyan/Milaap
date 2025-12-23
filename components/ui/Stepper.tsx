import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const total = steps.length;
  const baseWidth = total > 0 ? ((total - 1) / total) * 100 : 0;
  const progressWidth = total > 0 ? (currentStep / total) * 100 : 0;

  const progressWidthCapped = Math.max(0, Math.min(progressWidth, baseWidth));

  return (
    <nav aria-label="Progress" className="relative">
      {/* Horizontal track that connects centers of first and last icons */}
      <div className="hidden sm:block absolute top-4 h-0.5 bg-gray-700" style={{ left: '1rem', width: `${baseWidth}%` }} aria-hidden="true" />
      <div className="hidden sm:block absolute top-4 h-0.5 bg-amber-600" style={{ left: '1rem', width: `${progressWidthCapped}%` }} aria-hidden="true" />

      <ol role="list" className="flex flex-col sm:flex-row sm:items-center w-full">
        {steps.map((step, stepIdx) => (
          <li key={step} className={`relative flex items-center sm:flex-col sm:items-start ${stepIdx !== steps.length - 1 ? 'mb-4 sm:mb-0 sm:flex-1' : 'mb-0 sm:flex-1'}`}>
            {/* Vertical connector for mobile (shows completed state when stepIdx < currentStep) */}
            {stepIdx !== steps.length - 1 && (
                <div
                    className={`absolute left-3 top-7 bottom-0 w-px sm:hidden ${stepIdx < currentStep ? 'bg-amber-600' : 'bg-gray-700'}`}
                    aria-hidden="true"
                />
            )}

            {stepIdx < currentStep ? (
              <>

                <div className="relative w-8 h-8 flex items-center justify-start bg-amber-600 rounded-full hover:bg-amber-700 z-10">
                  <div className="flex items-center justify-center w-8 h-8">
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="relative w-8 h-8 flex items-center justify-start bg-gray-800 border-2 border-amber-600 rounded-full z-10" aria-current="step">
                  <div className="flex items-center justify-center w-8 h-8">
                    <span className="h-2.5 w-2.5 bg-amber-600 rounded-full" aria-hidden="true" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative w-8 h-8 flex items-center justify-start bg-gray-800 border-2 border-gray-600 rounded-full group-hover:border-gray-400 z-10">
                  <div className="flex items-center justify-center w-8 h-8">
                    <span className="h-2.5 w-2.5 bg-transparent rounded-full" aria-hidden="true" />
                  </div>
                </div>
              </>
            )}

             <span className="ml-3 sm:ml-0 block text-xs font-semibold text-gray-300 text-left sm:text-left sm:mt-3 max-w-[12rem] truncate">{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;