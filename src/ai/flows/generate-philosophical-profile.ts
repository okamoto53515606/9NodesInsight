'use server';

/**
 * 哲学的プロフィール生成フロー（Server Action）
 *
 * @description
 * 'use server' ファイルでは async 関数のみ export 可能。
 * スキーマ定義は @/ai/schemas に分離しています。
 *
 * 二段階生成:
 * 1. gemini-2.5-flash-lite + Google Search → 客観的情報を収集
 * 2. gemini-3.5-flash-lite → 検索結果を踏まえてプロフィール生成
 */

import { genai, SEARCH_MODEL, GENERATE_MODEL } from '@/ai/genai';
import type {
  GeneratePhilosophicalProfileInput,
  GeneratePhilosophicalProfileOutput,
} from '@/ai/schemas';
import {
  PHILOSOPHICAL_PROFILE_PROMPT,
  SEARCH_QUERY_PROMPT,
} from '@/lib/prompt';

// ── メイン関数（Server Action として export） ──────────────────

export async function generatePhilosophicalProfile(
  input: GeneratePhilosophicalProfileInput,
): Promise<GeneratePhilosophicalProfileOutput> {
  // Step 1: Google検索で客観的情報を収集（gemini-2.5-flash-lite）
  const searchResult = await searchWithGrounding(input);

  // Step 2: 検索結果を踏まえてプロフィールを生成（gemini-3.5-flash-lite）
  const profileText = await generateProfile(input, searchResult);

  return { profile: profileText, searchContext: searchResult };
}

// ── Step 1: Google検索グラウンディング ──────────────────────────

async function searchWithGrounding(
  input: GeneratePhilosophicalProfileInput,
): Promise<string> {
  const allItems = [
    ...input.favoriteSongs.map((s) => `曲「${s}」`),
    ...input.favoriteBooks.map((b) => `本「${b}」`),
    ...input.favoriteWords.map((w) => `言葉「${w}」`),
  ];

  const searchPrompt = SEARCH_QUERY_PROMPT.replace(
    '{{items}}',
    allItems.join('\n'),
  );

  try {
    const ai = genai();
    console.log('[searchWithGrounding] Starting Google Search with model:', SEARCH_MODEL);

    const response = await ai.models.generateContent({
      model: SEARCH_MODEL,
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text ?? '';
    console.log('[searchWithGrounding] Search completed, length:', text.length);
    return text;
  } catch (error) {
    console.error('[searchWithGrounding] Failed:', error);
    return ''; // 検索失敗時は検索なしで続行
  }
}

// ── Step 2: プロフィール生成 ──────────────────────────────────

async function generateProfile(
  input: GeneratePhilosophicalProfileInput,
  searchContext: string,
): Promise<string> {
  let prompt = PHILOSOPHICAL_PROFILE_PROMPT;

  prompt = prompt.replace(
    '{{favoriteSongs}}',
    input.favoriteSongs.map((s, i) => `${i + 1}. ${s}`).join('\n'),
  );
  prompt = prompt.replace(
    '{{favoriteBooks}}',
    input.favoriteBooks.map((b, i) => `${i + 1}. ${b}`).join('\n'),
  );
  prompt = prompt.replace(
    '{{favoriteWords}}',
    input.favoriteWords.map((w, i) => `${i + 1}. ${w}`).join('\n'),
  );
  prompt = prompt.replace('{{messageToAI}}', input.messageToAI);
  prompt = prompt.replace(
    '{{searchContext}}',
    searchContext || '（Google検索による追加情報は取得できませんでした）',
  );

  const ai = genai();
  console.log('[generateProfile] Starting profile generation with model:', GENERATE_MODEL);

  const response = await ai.models.generateContent({
    model: GENERATE_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'text/plain',
    },
  });

  let text = response.text ?? '';
  // モデルが誤って "profile:" や "profile: |" プレフィックスを付けた場合に除去
  text = text.replace(/^profile:\s*\|?\s*/i, '').trim();
  console.log('[generateProfile] Generation completed, length:', text.length);
  return text;
}
