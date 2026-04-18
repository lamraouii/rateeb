/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function searchQuranAndHadith(query: string) {
  const prompt = `Search for Quran verses and Sahih Hadith related to the following topic: "${query}". 
  Provide original Arabic text and a brief context for each result. 
  Format the response as a clear list. 
  If possible, include the Surah name and Verse number for Quran, and the Narrator/Book for Hadith.
  Always emphasize the spiritual beauty and calmness of the message.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No results found.";
  } catch (error) {
    console.error("Search error:", error);
    return "An error occurred while searching. Please try again later.";
  }
}
