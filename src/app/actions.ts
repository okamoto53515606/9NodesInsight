'use server';

import {
  generatePhilosophicalProfile,
} from '@/ai/flows/generate-philosophical-profile';
import type { GeneratePhilosophicalProfileInput } from '@/ai/schemas';

export async function getPhilosophicalProfile(
  input: GeneratePhilosophicalProfileInput
) {
  try {
    const profile = await generatePhilosophicalProfile(input);
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error in getPhilosophicalProfile:', error);
    const errorMessage = String(error);
    return { success: false, error: `分析に失敗しました。詳細: ${errorMessage}` };
  }
}
