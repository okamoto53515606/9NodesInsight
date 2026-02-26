import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // 最新の画像認識能力が高いモデルに変更
  model: 'googleai/gemini-3.1-pro-preview',
});
