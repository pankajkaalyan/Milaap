import { useState, useCallback, ChangeEvent } from 'react';
import { FormErrors, ValidationSchema } from '../types';

export const useForm = <T extends object>(
  initialState: T,
  validationSchema: ValidationSchema<T>,
  onSubmit?: (formData: T) => void
) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const validate = useCallback((fieldsToValidate?: (keyof T)[]) => {
    const newErrors: FormErrors<T> = {};
    const keysToValidate = fieldsToValidate || (Object.keys(validationSchema) as (keyof T)[]);

    for (const key of keysToValidate) {
      const validators = validationSchema[key as keyof T];
      if (validators) {
        const value = formData[key as keyof T];
        const validatorArray = Array.isArray(validators) ? validators : [validators];

        for (const validator of validatorArray) {
          const error = validator(value, formData);
          if (error) {
            newErrors[key as keyof T] = error;
            break; // Stop at the first error for a field
          }
        }
      }
    }

    setErrors(prevErrors => {
      const updatedErrors = { ...prevErrors };
      // Update errors only for the fields that were validated
      for (const key of keysToValidate) {
          if (newErrors[key as keyof T]) {
              updatedErrors[key as keyof T] = newErrors[key as keyof T];
          } else {
              delete updatedErrors[key as keyof T];
          }
      }
      return updatedErrors;
    });
    
    return Object.keys(newErrors).length === 0;
  }, [formData, validationSchema]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const setFieldValue = <K extends keyof T>(name: K, value: T[K]) => {
     setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate(Object.keys(validationSchema) as (keyof T)[]) && onSubmit) {
      onSubmit(formData);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleInputChange,
    setFieldValue,
    handleSubmit,
    validate,
    setErrors
  };
};