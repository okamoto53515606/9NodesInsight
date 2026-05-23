/**
 * Genkit AI初期化
 * 
 * Google AI (Gemini)を使用した記事生成AIの初期化を行います。
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
  model: 'googleai/gemini-3.1-flash-lite',
});
