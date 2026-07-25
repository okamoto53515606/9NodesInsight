/**
 * Google GenAI SDK 初期化
 *
 * Genkitを廃止し、@google/genai SDKを直接使用します。
 * - 検索用モデル: gemini-2.5-flash-lite（最安価、Google Search対応）
 * - 生成用モデル: gemini-3.5-flash-lite（メイン生成）
 */

import { GoogleGenAI } from '@google/genai';

export const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY!,
});

/** Google検索グラウンディング用の最安価モデル */
export const SEARCH_MODEL = 'gemini-2.5-flash-lite';

/** プロフィール生成用のメインモデル */
export const GENERATE_MODEL = 'gemini-3.5-flash-lite';
