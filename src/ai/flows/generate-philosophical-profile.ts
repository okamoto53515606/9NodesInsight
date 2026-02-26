'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate a philosophical profile
 * based on a user's favorite songs, books, words, and a message to the AI.
 *
 * - generatePhilosophicalProfile - The main function to trigger the profile generation.
 * - GeneratePhilosophicalProfileInput - The input type for the function.
 * - GeneratePhilosophicalProfileOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Zod schema for the input to the philosophical profile generation flow.
 * It includes arrays for favorite songs, books, and words, and a string for a message to the AI.
 */
const GeneratePhilosophicalProfileInputSchema = z.object({
  favoriteSongs: z
    .array(z.string())
    .length(3)
    .describe('ユーザーが好きな曲3つ'),
  favoriteBooks: z
    .array(z.string())
    .length(3)
    .describe('ユーザーが好きな本3つ'),
  favoriteWords: z
    .array(z.string())
    .length(3)
    .describe('ユーザーが好きな言葉3つ'),
  messageToAI: z.string().describe('ユーザーからAIへの一言'),
});
export type GeneratePhilosophicalProfileInput = z.infer<
  typeof GeneratePhilosophicalProfileInputSchema
>;

/**
 * Zod schema for the output of the philosophical profile generation flow.
 * The output is a Markdown formatted string containing the generated profile.
 */
const GeneratePhilosophicalProfileOutputSchema = z
  .string()
  .describe('生成された哲学的なプロフィール（Markdown形式）');
export type GeneratePhilosophicalProfileOutput = z.infer<
  typeof GeneratePhilosophicalProfileOutputSchema
>;

/**
 * Raw prompt template for the philosophical profiling AI.
 * This template is designed to guide the AI in extracting deep philosophical insights
 * from seemingly disparate cultural inputs provided by the user.
 */
const PHILOSOPHICAL_PROFILE_PROMPT = `
# Role
あなたは、膨大な知識を持ち、一見バラバラな事象の奥底にある「構造」や「本質」を紐解く天才的なプロファイラーです。
ユーザーの入力から、表面的な好みを越えた「深層の哲学・価値観」を言語化し、温かく知的なトーンで提供してください。

# Input Data
- 好きな曲: [{{join favoriteSongs ", "}}]
- 好きな本: [{{join favoriteBooks ", "}}]
- 好きな言葉: [{{join favoriteWords ", "}}]
- 私（AI）への一言: [{{{messageToAI}}}]

# Analysis Guidelines
1. 【ジャンルの無効化と抽象化】ジャンルや時代背景などの表面的な分類を破棄し、「根源的なテーマ」「メタファー」だけを抽出せよ。
2. 【構造と共通項の発見】9つの要素の交差点を探し、すべてを貫く「1つの大きな共通項（テーマ・哲学）」を見つけ出せ。
3. 【ペルソナの立体的構築】9つの要素から見える「内なる哲学」と、AIへの一言から見える「外向けの人柄・気遣い」のコントラストを分析せよ。

# Output Format (Markdown)
## 【タイトル】（キャッチーで文学的な1行）
## 1. 9つの点から見えた「たったひとつの共通項」
## 2. あなたの「世界の見方（構造と哲学）」
## 3. 「AIへの一言」から読み解く、あなたの素顔
## 4. 総評：あなたという人を例えるなら
`;

/**
 * Defines a Genkit prompt for generating a philosophical profile.
 * It uses the Google Gemini API to analyze user inputs and output a Markdown profile.
 */
const generatePhilosophicalProfilePrompt = ai.definePrompt({
  name: 'generatePhilosophicalProfilePrompt',
  input: {schema: GeneratePhilosophicalProfileInputSchema},
  output: {schema: GeneratePhilosophicalProfileOutputSchema},
  prompt: PHILOSOPHICAL_PROFILE_PROMPT,
});

/**
 * Defines the Genkit flow for generating a philosophical profile.
 * This flow orchestrates the call to the AI prompt with the user's input.
 */
const generatePhilosophicalProfileFlow = ai.defineFlow(
  {
    name: 'generatePhilosophicalProfileFlow',
    inputSchema: GeneratePhilosophicalProfileInputSchema,
    outputSchema: GeneratePhilosophicalProfileOutputSchema,
  },
  async input => {
    const {output} = await generatePhilosophicalProfilePrompt(input);
    if (!output) {
      throw new Error('Failed to generate philosophical profile: No output received.');
    }
    return output;
  }
);

/**
 * Wrapper function to execute the philosophical profile generation flow.
 * @param input The user's preferences for songs, books, words, and a message to the AI.
 * @returns A promise that resolves to the generated philosophical profile in Markdown format.
 */
export async function generatePhilosophicalProfile(
  input: GeneratePhilosophicalProfileInput
): Promise<GeneratePhilosophicalProfileOutput> {
  return generatePhilosophicalProfileFlow(input);
}
