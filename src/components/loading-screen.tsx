'use client';

import { useMemo } from 'react';
import type { GeneratePhilosophicalProfileInput } from '@/ai/flows/generate-philosophical-profile';
import { DISCLAIMERS, PHILOSOPHICAL_PROFILE_PROMPT } from '@/lib/prompt';

export function LoadingScreen({
  formData,
}: {
  formData: GeneratePhilosophicalProfileInput;
}) {
  const fullPrompt = useMemo(() => {
    return PHILOSOPHICAL_PROFILE_PROMPT.replace(
      '{{#each favoriteSongs}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}',
      formData.favoriteSongs.join(', ')
    )
      .replace(
        '{{#each favoriteBooks}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}',
        formData.favoriteBooks.join(', ')
      )
      .replace(
        '{{#each favoriteWords}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}',
        formData.favoriteWords.join(', ')
      )
      .replace('{{{messageToAI}}}', formData.messageToAI);
  }, [formData]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black p-4 font-code text-[#00FF41]">
      <div className="flex-grow">
        <div className="mt-8 text-sm text-gray-400 space-y-2">
          {DISCLAIMERS.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm text-yellow-300">
            [生プロンプト] Gemini APIへ送信中...
          </p>
          <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-left select-all">
            {fullPrompt}
          </pre>
        </div>
        <div className="mt-8 text-center text-yellow-300 animate-pulse">
          AIによる分析を実行中です。しばらくお待ちください...
        </div>
      </div>

      {/* For LLMO/SEO */}
      <div className="sr-only">
        <h2>生プロンプT</h2>
        <pre>{fullPrompt}</pre>
        <h2>免責事項</h2>
        <p>{DISCLAIMERS}</p>
      </div>
    </div>
  );
}
