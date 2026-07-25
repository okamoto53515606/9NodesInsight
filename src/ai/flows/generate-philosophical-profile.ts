'use server';

/**
 * 哲学的プロフィール生成フロー
 *
 * @description
 * 二段階生成:
 * 1. gemini-2.5-flash-lite + Google Search → 各入力項目を検索し客観的情報を収集
 * 2. gemini-3.5-flash-lite → 検索結果を踏まえて哲学的なプロフィールを生成
 *
 * バーナム効果対策:
 * - 具体的な作品内容・歌詞・ストーリーに言及
 * - 反証可能な分析の提示
 * - ネガティブ面（矛盾・葛藤）の明示的な指摘
 */

import { z } from 'zod';
import { genai, SEARCH_MODEL, GENERATE_MODEL } from '@/ai/genai';
import {
  PHILOSOPHICAL_PROFILE_PROMPT,
  SEARCH_QUERY_PROMPT,
} from '@/lib/prompt';

// ── 入出力スキーマ ────────────────────────────────────────────

export const GeneratePhilosophicalProfileInputSchema = z.object({
  favoriteSongs: z
    .array(z.string().max(100, '100文字以内で入力してください。'))
    .length(3)
    .describe('ユーザーが好きな曲3つ'),
  favoriteBooks: z
    .array(z.string().max(100, '100文字以内で入力してください。'))
    .length(3)
    .describe('ユーザーが好きな本3つ'),
  favoriteWords: z
    .array(z.string().max(100, '100文字以内で入力してください。'))
    .length(3)
    .describe('ユーザーが好きな言葉3つ'),
  messageToAI: z
    .string()
    .max(100, '100文字以内で入力してください。')
    .describe('ユーザーからAIへの一言'),
});
export type GeneratePhilosophicalProfileInput = z.infer<
  typeof GeneratePhilosophicalProfileInputSchema
>;

export const GeneratePhilosophicalProfileOutputSchema = z.object({
  profile: z.string().describe('生成された哲学的なプロフィール（Markdown形式）'),
});
export type GeneratePhilosophicalProfileOutput = z.infer<
  typeof GeneratePhilosophicalProfileOutputSchema
>;

// ── メイン関数 ────────────────────────────────────────────────

export async function generatePhilosophicalProfile(
  input: GeneratePhilosophicalProfileInput,
): Promise<GeneratePhilosophicalProfileOutput> {
  // Step 1: Google検索で客観的情報を収集（gemini-2.5-flash-lite）
  const searchResult = await searchWithGrounding(input);

  // Step 2: 検索結果を踏まえてプロフィールを生成（gemini-3.5-flash-lite）
  const profileText = await generateProfile(input, searchResult);

  return { profile: profileText };
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
    const response = await genai.models.generateContent({
      model: SEARCH_MODEL,
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // 検索は低温度で事実重視
      },
    });

    return response.text ?? '';
  } catch (error) {
    console.error('Search grounding failed, continuing without search:', error);
    return ''; // 検索失敗時は検索なしで続行
  }
}

// ── Step 2: プロフィール生成 ──────────────────────────────────

async function generateProfile(
  input: GeneratePhilosophicalProfileInput,
  searchContext: string,
): Promise<string> {
  // プロンプトのプレースホルダーを置換
  let prompt = PHILOSOPHICAL_PROFILE_PROMPT;

  // 好きな曲
  prompt = prompt.replace(
    '{{favoriteSongs}}',
    input.favoriteSongs.map((s, i) => `${i + 1}. ${s}`).join('\n'),
  );
  // 好きな本
  prompt = prompt.replace(
    '{{favoriteBooks}}',
    input.favoriteBooks.map((b, i) => `${i + 1}. ${b}`).join('\n'),
  );
  // 好きな言葉
  prompt = prompt.replace(
    '{{favoriteWords}}',
    input.favoriteWords.map((w, i) => `${i + 1}. ${w}`).join('\n'),
  );
  // AIへの一言
  prompt = prompt.replace('{{messageToAI}}', input.messageToAI);
  // 検索結果
  prompt = prompt.replace(
    '{{searchContext}}',
    searchContext || '（Google検索による追加情報は取得できませんでした）',
  );

  const response = await genai.models.generateContent({
    model: GENERATE_MODEL,
    contents: prompt,
    config: {
      temperature: 0.8,
      maxOutputTokens: 4096,
    },
  });

  return response.text ?? '';
}
