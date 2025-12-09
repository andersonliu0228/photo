import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import EraSelector from './components/EraSelector';
import ResultView from './components/ResultView';
import { Era } from './types';
import { generateTimeTravelImage } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'camera' | 'era' | 'processing' | 'result'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setCurrentStep('era');
  };

  const handleEraSelect = async (era: Era) => {
    setSelectedEra(era);
    if (!capturedImage) return;

    setCurrentStep('processing');
    setLoadingMessage(`Traveling to ${era.name}...`);
    
    try {
      // We pass the captured image and the specific era prompt
      const generated = await generateTimeTravelImage(capturedImage, era.prompt);
      setResultImage(generated);
      setCurrentStep('result');
    } catch (error) {
      console.error(error);
      alert("Time travel failed! The wormhole was unstable. Please try again.");
      setCurrentStep('era');
    }
  };

  const resetApp = () => {
    setCapturedImage(null);
    setResultImage(null);
    setSelectedEra(null);
    setCurrentStep('camera');
  };

  return (
    <div className="min-h-screen bg-chrono-dark text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-chrono-dark/80 backdrop-blur-md border-b border-gray-800 flex items-center px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-chrono-accent to-neon-blue p-2 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            ChronoSnap
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
          <span className="hidden sm:inline">Powered by Gemini</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-10 px-4 flex flex-col items-center min-h-screen justify-center">
        
        {/* Progress Stepper */}
        {currentStep !== 'processing' && (
          <div className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className={currentStep === 'camera' ? 'text-chrono-accent' : ''}>1. Snap</span>
            <span className="w-4 h-[1px] bg-gray-700"></span>
            <span className={currentStep === 'era' ? 'text-chrono-accent' : ''}>2. Select Time</span>
            <span className="w-4 h-[1px] bg-gray-700"></span>
            <span className={currentStep === 'result' ? 'text-chrono-accent' : ''}>3. Experience</span>
          </div>
        )}

        {currentStep === 'camera' && (
          <div className="w-full max-w-lg animate-fade-in">
             <CameraCapture onCapture={handleCapture} />
          </div>
        )}

        {currentStep === 'era' && capturedImage && (
          <div className="w-full flex flex-col items-center animate-fade-in">
             <div className="w-24 h-24 rounded-full border-2 border-gray-700 overflow-hidden mb-6 shadow-xl">
               <img src={capturedImage} alt="You" className="w-full h-full object-cover" />
             </div>
             <EraSelector onSelectEra={handleEraSelect} />
             <button 
               onClick={() => setCurrentStep('camera')}
               className="mt-8 text-gray-500 hover:text-white underline text-sm"
             >
               Retake Photo
             </button>
          </div>
        )}

        {currentStep === 'processing' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-chrono-panel rounded-full"></div>
              <div className="absolute inset-0 border-4 border-chrono-accent border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-neon-blue border-b-transparent rounded-full animate-spin-slow opacity-70"></div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white animate-pulse">{loadingMessage}</h2>
              <p className="text-gray-400">Calibrating temporal flux capacitors...</p>
            </div>
          </div>
        )}

        {currentStep === 'result' && resultImage && capturedImage && (
          <ResultView 
            originalImage={capturedImage}
            resultImage={resultImage}
            onReset={resetApp}
            onUpdateResult={(newImg) => setResultImage(newImg)}
          />
        )}
      </main>
    </div>
  );
};

export default App;