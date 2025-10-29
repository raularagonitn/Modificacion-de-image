import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    if(!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if(disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed border-gray-600 rounded-xl p-8 text-center transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-cyan-400 hover:bg-gray-800/50'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-semibold">Click to upload or drag & drop</p>
        <p className="text-sm">PNG, JPG, or other image formats</p>
      </div>
    </div>
  );
};

export default ImageUploader;
