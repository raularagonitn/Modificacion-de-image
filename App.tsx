import React, { useState, useCallback } from 'react';
import { editImageWithGemini } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import ImageViewer from './components/ImageViewer';
import ImageUploader from './components/ImageUploader';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageBase64, setOriginalImageBase64] = useState<string | null>(null);
  const [editedImageBase64, setEditedImageBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPEG, etc.).');
      return;
    }
    
    setError(null);
    setEditedImageBase64(null);
    setOriginalImageFile(file);
    setOriginalImageBase64(null);

    try {
      const base64 = await fileToBase64(file);
      setOriginalImageBase64(base64);
    } catch (e) {
      setError('Failed to read the image file.');
      console.error(e);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!originalImageBase64 || !originalImageFile || !prompt.trim()) {
      setError('Please upload an image and enter an editing prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImageBase64(null);

    try {
      const resultBase64 = await editImageWithGemini(
        originalImageBase64,
        originalImageFile.type,
        prompt
      );
      setEditedImageBase64(resultBase64);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [originalImageBase64, originalImageFile, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            Gemini Image Editor
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload an image, describe your desired edit, and let Gemini's magic transform it.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-cyan-300">1. Upload Your Image</h2>
              <ImageUploader onImageSelect={handleImageSelect} disabled={isLoading} />
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-cyan-300">2. Describe Your Edit</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a retro filter', 'Make the sky look like a galaxy', 'Change the background to a beach at sunset'"
                className="w-full h-32 p-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
                disabled={!originalImageFile || isLoading}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!originalImageFile || !prompt.trim() || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:from-cyan-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                '✨ Generate Image'
              )}
            </button>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mt-4 text-center">
                <p><strong>Oops!</strong> {error}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <ImageViewer
              title="Original"
              imageData={originalImageBase64}
              mimeType={originalImageFile?.type}
            />
            <ImageViewer
              title="Edited with Gemini"
              imageData={editedImageBase64}
              mimeType={originalImageFile?.type}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
