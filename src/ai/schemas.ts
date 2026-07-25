/**
 * 9Nodes Insight - 入出力スキーマ定義
 *
 * 'use server' ファイルでは async 関数以外の export が禁止されているため、
 * Zod スキーマとその型はこのファイルで一元管理します。
 */

import { z } from 'zod';

// ── 入力スキーマ ──────────────────────────────────────────────

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

// ── 出力スキーマ ──────────────────────────────────────────────

export const GeneratePhilosophicalProfileOutputSchema = z.object({
  profile: z.string().describe('生成された哲学的なプロフィール（Markdown形式）'),
});
export type GeneratePhilosophicalProfileOutput = z.infer<
  typeof GeneratePhilosophicalProfileOutputSchema
>;
