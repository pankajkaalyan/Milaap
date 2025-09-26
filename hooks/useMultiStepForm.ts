import { useState, useCallback } from 'react';

export const useMultiStepForm = (totalSteps: number) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = useCallback(() => {
        setCurrentStep(prev => (prev < totalSteps - 1 ? prev + 1 : prev));
    }, [totalSteps]);

    const back = useCallback(() => {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
    }, []);

    const goTo = useCallback((step: number) => {
        if (step >= 0 && step < totalSteps) {
            setCurrentStep(step);
        }
    }, [totalSteps]);

    return {
        currentStep,
        next,
        back,
        goTo,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === totalSteps - 1,
    };
};
