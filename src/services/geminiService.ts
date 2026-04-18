/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function searchQuranAndHadith(query: string) {
  if (!genAI) {
    return "API key missing.";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-pro", // safer stable model
  });

  const prompt = `Search for Quran verses and Sahih Hadith related to the following topic: "${query}". 
Provide original Arabic text and a brief context for each result. 
Format the response as a clear list. 
If possible, include the Surah name and Verse number for Quran, and the Narrator/Book for Hadith.
Always emphasize the spiritual beauty and calmness of the message.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text() || "No results found.";
  } catch (error) {
    console.error("Search error:", error);
    return "An error occurred while searching.";
  }
}