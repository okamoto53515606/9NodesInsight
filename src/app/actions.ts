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
    console.error('Error generating philosophical profile:', error);
    // In a real app, you might want to log this error to a monitoring service
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `分析に失敗しました。詳細: ${errorMessage}` };
  }
}
