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
import { PHILOSOPHICAL_PROFILE_PROMPT } from '@/lib/prompt';
import {z} from 'genkit';

/**
 * Zod schema for the input to the philosophical profile generation flow.
 * It includes arrays for favorite songs, books, and words, and a string for a message to the AI.
 */
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
 * Defines a Genkit prompt for generating a philosophical profile.
 * It uses the Google Gemini API to analyze user inputs and output a Markdown profile.
 */
const generatePhilosophicalProfilePrompt = ai.definePrompt({
  name: 'generatePhilosophicalProfilePrompt',
  input: {schema: GeneratePhilosophicalProfileInputSchema},
  output: {schema: GeneratePhilosophicalProfileOutputSchema},
  prompt: PHILOSOPHICAL_PROFILE_PROMPT,
  model: 'googleai/gemini-1.5-pro-preview',
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
    const response = await generatePhilosophicalProfilePrompt(input);
    const output = response.output;

    if (!output) {
      let errorDetails = 'AIから有効な応答がありませんでした。';
      const candidate = response.candidate;
      if (candidate) {
        errorDetails += ` 理由: ${candidate.finishReason}`;
        if (candidate.finishMessage) {
          errorDetails += `, メッセージ: ${candidate.finishMessage}`;
        }
        if (candidate.safetyRatings && candidate.safetyRatings.length > 0) {
          errorDetails += `, 安全性評価: ${JSON.stringify(
            candidate.safetyRatings
          )}`;
        }
      }
      const rawText = response.text;
      if (rawText) {
        errorDetails += `\nAIの生テキスト応答: "${rawText}"`;
      }
      throw new Error(errorDetails);
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
