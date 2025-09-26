import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number | string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, unit, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}: <span className="font-bold text-amber-400">{value}{unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
        {...props}
      />
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #F59E0B; /* amber-500 */
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
        }

        .slider-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #F59E0B;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default Slider;