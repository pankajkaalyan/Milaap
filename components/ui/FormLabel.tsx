interface LabelProps {
  id: string;
  label: string;
  required?: boolean; // mark field as mandatory
}

const FormLabel: React.FC<LabelProps> = ({ id, label, required }) => {
  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label}
      {
        required ? (
          <span className="text-red-500 ml-1" >* </span> // show * for required
        ) : (
          <span className="text-gray-400 ml-1 text-xs" > (Optional) </span>
        )}
    </label>
  );
};

export default FormLabel;
