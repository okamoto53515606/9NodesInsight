/**
 * Google GenAI SDK 初期化（遅延初期化）
 *
 * Genkitを廃止し、@google/genai SDKを直接使用します。
 * - 検索用モデル: gemini-2.5-flash-lite（最安価、Google Search対応）
 * - 生成用モデル: gemini-3.5-flash-lite（メイン生成）
 */

import { GoogleGenAI } from '@google/genai/node';

let _genai: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!_genai) {
    // Cloud Run 上では ADC より API キーを優先させるため明示的に渡す
    _genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _genai;
}

export { getGenAI as genai };

/** Google検索グラウンディング用の最安価モデル */
export const SEARCH_MODEL = 'gemini-2.5-flash-lite';

/** プロフィール生成用のメインモデル */
export const GENERATE_MODEL = 'gemini-3.5-flash-lite';
