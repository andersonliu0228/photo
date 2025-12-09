export interface Era {
  id: string;
  name: string;
  description: string;
  prompt: string;
  imagePlaceholder: string;
}

export interface GeneratedImage {
  id: string;
  originalImage: string; // Base64
  resultImage: string; // Base64
  eraId: string;
  timestamp: number;
  promptUsed: string;
}

export type AppState = 'camera' | 'preview' | 'processing' | 'result' | 'gallery';

export interface AnalysisResult {
  text: string;
  isLoading: boolean;
}