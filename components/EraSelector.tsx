import React from 'react';
import { Era } from '../types';
import { ERAS } from '../constants';

interface EraSelectorProps {
  onSelectEra: (era: Era) => void;
  selectedEraId?: string;
}

const EraSelector: React.FC<EraSelectorProps> = ({ onSelectEra, selectedEraId }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
        Select Destination Time
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ERAS.map((era) => (
          <button
            key={era.id}
            onClick={() => onSelectEra(era)}
            className={`
              relative overflow-hidden rounded-xl border-2 transition-all duration-300 group text-left h-48
              ${selectedEraId === era.id 
                ? 'border-chrono-accent shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-105 z-10' 
                : 'border-gray-700 hover:border-gray-500 hover:scale-102 opacity-80 hover:opacity-100'}
            `}
          >
            <div className="absolute inset-0 bg-black">
              <img 
                src={era.imagePlaceholder} 
                alt={era.name} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-lg font-bold text-white mb-1">{era.name}</h3>
              <p className="text-xs text-gray-300 line-clamp-2">{era.description}</p>
            </div>

            {selectedEraId === era.id && (
              <div className="absolute top-2 right-2 bg-chrono-accent text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EraSelector;