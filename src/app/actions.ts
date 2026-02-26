'use server';

import {
  generatePhilosophicalProfile,
  type GeneratePhilosophicalProfileInput,
} from '@/ai/flows/generate-philosophical-profile';

export async function getPhilosophicalProfile(
  input: GeneratePhilosophicalProfileInput
) {
  try {
    const profile = await generatePhilosophicalProfile(input);
    return { success: true, data: profile };
  } catch (error) {
    const errorMessage = String(error);
    return { success: false, error: `分析に失敗しました。詳細: ${errorMessage}` };
  }
}
