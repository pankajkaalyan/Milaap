import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  id: string;
  label: string;
  description: string;
  onFilesChange: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, description, onFilesChange, accept, multiple = false, maxFiles = 1 }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const newFiles = multiple ? [...files, ...selectedFiles].slice(0, maxFiles) : selectedFiles.slice(0, 1);
      setFiles(newFiles);
      onFilesChange(newFiles);

      // Generate previews for image files
      const newPreviews: string[] = [];
      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            if (newPreviews.length === newFiles.filter(f => f.type.startsWith('image/')).length) {
                setPreviews(newPreviews);
            }
          };
          reader.readAsDataURL(file);
        }
      });
      if(newFiles.some(f => !f.type.startsWith('image/'))) {
        setPreviews([]);
      }
    }
  }, [files, maxFiles, multiple, onFilesChange]);

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFilesChange(updatedFiles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-amber-500 transition-colors">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-400">
            <label htmlFor={id} className="relative cursor-pointer bg-transparent rounded-md font-medium text-amber-400 hover:text-amber-300 focus-within:outline-none">
              <span>Upload a file</span>
              <input id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept={accept} multiple={multiple} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
          {previews.map((src, index) => (
            <div key={index} className="relative group">
              <img src={src} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
       {files.length > 0 && previews.length === 0 && (
         <div className="mt-2 text-sm text-gray-300">
            {files.map(file => <div key={file.name}>{file.name}</div>)}
         </div>
       )}
    </div>
  );
};

export default FileUpload;