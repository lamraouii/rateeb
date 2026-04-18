/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export function searchQuranAndHadith(query: string): any {
 return query;
}


export function getModel() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; //process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.warn("No API key found");
    return null; // VERY IMPORTANT
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: "gemini-pro",
  });
}