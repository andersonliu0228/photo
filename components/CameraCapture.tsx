import React, { useRef, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (err) {
      setError("無法存取相機。請允許權限或使用上傳檔案。");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Mirror the image to feel like a mirror
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera on mount if possible, or provide button
  React.useEffect(() => {
    // Cleanup on unmount
    return () => stopCamera();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 aspect-[3/4] flex items-center justify-center group">
        
        {!isStreamActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-chrono-panel bg-opacity-90 p-6 text-center space-y-6">
            <div className="p-4 rounded-full bg-chrono-dark border border-chrono-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-chrono-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">準備好穿越時空了嗎？</h2>
            <p className="text-gray-400">拍張自拍或上傳照片，開啟你的歷史之旅。</p>
            
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={startCamera}
                className="w-full py-3 px-6 bg-chrono-accent hover:bg-chrono-accent-hover text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                啟動相機
              </button>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full py-3 px-6 bg-transparent border border-gray-600 hover:border-white text-gray-300 hover:text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  上傳照片
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        )}

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover transform -scale-x-100 ${!isStreamActive ? 'hidden' : ''}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {isStreamActive && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
            <button 
              onClick={capturePhoto}
              className="h-16 w-16 bg-white rounded-full border-4 border-gray-300 hover:border-chrono-accent transition-all transform hover:scale-110 shadow-lg"
              aria-label="Take Photo"
            ></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;