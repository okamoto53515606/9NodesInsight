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
    return { success: false, error: 'Failed to generate profile.' };
  }
}
