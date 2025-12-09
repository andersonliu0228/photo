import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a base64 string to the format expected by the Gemini API parts.
 * Strips the data URL prefix if present.
 */
const cleanBase64 = (b64: string) => {
  return b64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (b64: string) => {
  const match = b64.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
  return match ? `image/${match[1]}` : 'image/jpeg';
}

/**
 * Generates a historical scene or edits an image based on a prompt.
 * Uses 'gemini-2.5-flash-image' for image editing/generation capabilities.
 */
export const generateTimeTravelImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    const cleanData = cleanBase64(imageBase64);
    const mimeType = getMimeType(imageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType,
            },
          },
        ],
      },
    });

    // Extract the image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating time travel image:", error);
    throw error;
  }
};

/**
 * Analyzes an image using 'gemini-3-pro-preview'.
 */
export const analyzeImage = async (imageBase64: string): Promise<string> => {
  try {
    const cleanData = cleanBase64(imageBase64);
    const mimeType = getMimeType(imageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image in detail. Describe the era, the clothing, the style, and any interesting anomalies. Keep it concise but insightful.",
          },
        ],
      },
    });

    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};