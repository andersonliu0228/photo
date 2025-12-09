import React, { useState } from 'react';
import { generateTimeTravelImage, analyzeImage } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface ResultViewProps {
  originalImage: string;
  resultImage: string;
  onReset: () => void;
  onUpdateResult: (newImage: string) => void;
}

const ResultView: React.FC<ResultViewProps> = ({ originalImage, resultImage, onReset, onUpdateResult }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'analyze'>('view');
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    setIsProcessing(true);
    try {
      const newImage = await generateTimeTravelImage(resultImage, editPrompt);
      onUpdateResult(newImage);
      setEditPrompt('');
      setActiveTab('view');
    } catch (error) {
      alert("編輯失敗，請再試一次。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (analysis) return; // Already analyzed
    setAnalysis({ text: '', isLoading: true });
    try {
      const text = await analyzeImage(resultImage);
      setAnalysis({ text, isLoading: false });
    } catch (error) {
      setAnalysis({ text: '分析失敗。', isLoading: false });
    }
  };

  // Trigger analysis when tab changes to analyze
  React.useEffect(() => {
    if (activeTab === 'analyze' && !analysis) {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center animate-fade-in">
      
      {/* Top Controls */}
      <div className="w-full flex justify-between items-center mb-6">
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          返回時光機
        </button>
        <div className="flex gap-2">
           <a 
            href={resultImage} 
            download="chrono-snap-result.png"
            className="bg-chrono-panel hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
           >
             下載
           </a>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        
        {/* Main Image Display */}
        <div className="flex-1 flex flex-col items-center">
           <div className="relative w-full max-w-lg aspect-square rounded-xl overflow-hidden shadow-2xl border-2 border-chrono-accent group">
             {isProcessing && (
               <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-white">
                 <div className="w-12 h-12 border-4 border-chrono-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="animate-pulse">正在修正時間線...</p>
               </div>
             )}
             <img src={resultImage} alt="Time Travel Result" className="w-full h-full object-cover" />
             
             {/* Original Hover Peek */}
             <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-24 h-24 rounded border border-white overflow-hidden shadow-lg bg-black">
                 <img src={originalImage} alt="Original" className="w-full h-full object-cover opacity-80" />
               </div>
               <p className="text-xs text-white text-center mt-1 bg-black/50 rounded">原始影像</p>
             </div>
           </div>
        </div>

        {/* Tools Panel */}
        <div className="w-full lg:w-96 bg-chrono-panel rounded-xl border border-gray-700 overflow-hidden flex flex-col h-[500px]">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeTab === 'view' ? 'text-chrono-accent border-b-2 border-chrono-accent' : 'text-gray-400 hover:text-white'}`}
            >
              詳細資訊
            </button>
            <button 
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeTab === 'edit' ? 'text-chrono-accent border-b-2 border-chrono-accent' : 'text-gray-400 hover:text-white'}`}
            >
              <div className="flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                編輯
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('analyze')}
              className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeTab === 'analyze' ? 'text-chrono-accent border-b-2 border-chrono-accent' : 'text-gray-400 hover:text-white'}`}
            >
              <div className="flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                分析
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === 'view' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">傳送成功！</h3>
                <p className="text-gray-300 text-sm">
                  你已抵達目的地。時間置換成功。使用上方標籤修改現實或分析環境。
                </p>
                <div className="bg-chrono-dark p-4 rounded border border-gray-700">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">啟用功能</p>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Gemini 2.5 Flash Image (影像編輯)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Gemini 3 Pro Preview (視覺分析)
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    現實編輯器
                  </label>
                  <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="例如：'加入復古濾鏡', '變成晚上', '背景加入機器人'..."
                    className="w-full h-32 bg-chrono-dark border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-chrono-accent focus:border-transparent resize-none text-sm"
                  />
                </div>
                <button
                  onClick={handleEdit}
                  disabled={!editPrompt.trim() || isProcessing}
                  className="w-full py-3 bg-chrono-accent disabled:bg-gray-600 text-white rounded-lg font-bold transition-transform active:scale-95"
                >
                  應用變更
                </button>
              </div>
            )}

            {activeTab === 'analyze' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">時間分析</h3>
                {analysis?.isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-blue-400">正在掃描粒子...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                     <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                       {analysis?.text || "無分析數據。"}
                     </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;