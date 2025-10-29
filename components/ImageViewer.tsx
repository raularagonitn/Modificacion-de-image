import React from 'react';

interface ImageViewerProps {
  title: string;
  imageData: string | null;
  mimeType?: string;
  isLoading?: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageData, mimeType, isLoading = false }) => {
  const imageUrl = imageData && mimeType ? `data:${mimeType};base64,${imageData}` : null;
  
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center">{title}</h3>
      <div className="relative flex-grow bg-gray-900/50 rounded-lg flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
              <p className="text-cyan-300">Generating your masterpiece...</p>
            </div>
          </div>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
        ) : (
          !isLoading && <p className="text-gray-500">Image will appear here</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
