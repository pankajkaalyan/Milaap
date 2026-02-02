import React from 'react';

interface LabelProps {
  id: string;
  label: string;
  required?: boolean; // mark field as mandatory
  hideinfo?: string;
}

const FormLabel: React.FC<LabelProps> = ({ id, label, required, hideinfo }) => {
  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-1 whitespace-pre-line"
    >
      {label}

      {hideinfo !== "true" && (
        required ? (
          <span className="text-red-500 ml-1">*</span>  
        ) : (
          <span className="text-gray-400 ml-1 text-xs">(Optional)</span>
        )
      )}
    </label>
  );
};

export default FormLabel;
