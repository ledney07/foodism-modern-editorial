
import { GoogleGenAI } from "@google/genai";

// Fix: Refactor to use process.env.API_KEY directly as required by the latest GenAI guidelines.
export const getArticleAISummary = async (content: string): Promise<string> => {
  try {
    // CRITICAL: Always use the process.env.API_KEY directly when initializing GoogleGenAI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this editorial article in exactly 3 bullet points that capture the "vibe" and key "takeaway" for a sophisticated foodie reader: ${content.substring(0, 2000)}`,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    // Fix: Ensure .text property is accessed directly as per the correct method.
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI is currently dining out. Please check back later.";
  }
};
