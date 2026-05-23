'use server';

/**
 * 哲学的プロフィール生成フロー
 *
 * @description
 * ユーザーの好きな曲、本、言葉、そしてAIへのメッセージに基づいて、
 * 哲学的なプロフィールをAIで生成します。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PHILOSOPHICAL_PROFILE_PROMPT } from '@/lib/prompt';

// フローの入力スキーマ
const GeneratePhilosophicalProfileInputSchema = z.object({
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
  messageToAI: z.string().max(100, '100文字以内で入力してください。').describe('ユーザーからAIへの一言'),
});
export type GeneratePhilosophicalProfileInput = z.infer<typeof GeneratePhilosophicalProfileInputSchema>;

// フローの出力スキーマ
const GeneratePhilosophicalProfileOutputSchema = z.object({
  profile: z.string().describe('生成された哲学的なプロフィール（Markdown形式）'),
});
export type GeneratePhilosophicalProfileOutput = z.infer<typeof GeneratePhilosophicalProfileOutputSchema>;

// エクスポートされるメイン関数
export async function generatePhilosophicalProfile(input: GeneratePhilosophicalProfileInput): Promise<GeneratePhilosophicalProfileOutput> {
  return generatePhilosophicalProfileFlow(input);
}

// AIに渡すプロンプトの定義
const philosophicalProfilePrompt = ai.definePrompt({
  name: 'philosophicalProfilePrompt',
  input: {schema: GeneratePhilosophicalProfileInputSchema},
  output: {schema: GeneratePhilosophicalProfileOutputSchema},
  prompt: PHILOSOPHICAL_PROFILE_PROMPT,
});

// Genkitフローの定義
const generatePhilosophicalProfileFlow = ai.defineFlow(
  {
    name: 'generatePhilosophicalProfileFlow',
    inputSchema: GeneratePhilosophicalProfileInputSchema,
    outputSchema: GeneratePhilosophicalProfileOutputSchema,
  },
  async input => {
    // プロンプトを実行し、整形された出力を待つ
    const {output} = await philosophicalProfilePrompt(input);
    return output!;
  }
);
