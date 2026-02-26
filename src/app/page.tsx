'use client';

import { useState } from 'react';
import type { GeneratePhilosophicalProfileInput } from '@/ai/flows/generate-philosophical-profile';
import { getPhilosophicalProfile } from '@/app/actions';
import { InputForm } from '@/components/input-form';
import { LoadingScreen } from '@/components/loading-screen';
import { ResultDisplay } from '@/components/result-display';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [
    formData,
    setFormData,
  ] = useState<GeneratePhilosophicalProfileInput | null>(null);
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const handleStart = async (data: GeneratePhilosophicalProfileInput) => {
    setFormData(data);
    setStep('loading');

    const response = await getPhilosophicalProfile(data);

    if (response.success && response.data) {
      setResult(response.data);
      setStep('result');
    } else {
      setStep('form');
      toast({
        title: 'エラー',
        description: response.error || '分析に失敗しました。時間をおいて再度お試しください。',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setStep('form');
    setFormData(null);
    setResult('');
  };

  const renderStep = () => {
    switch (step) {
      case 'loading':
        return <LoadingScreen formData={formData!} />;
      case 'result':
        return <ResultDisplay profile={result} onReset={handleReset} />;
      case 'form':
      default:
        return <InputForm onSubmit={handleStart} initialData={formData} />;
    }
  };

  return (
    <main className="min-h-screen w-full">
      {renderStep()}
    </main>
  );
}
