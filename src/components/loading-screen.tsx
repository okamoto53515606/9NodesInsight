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
      '{{#each favoriteSongs}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}',
      formData.favoriteSongs.join(', ')
    )
      .replace(
        '{{#each favoriteBooks}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}',
        formData.favoriteBooks.join(', ')
      )
      .replace(
        '{{#each favoriteWords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}',
        formData.favoriteWords.join(', ')
      )
      .replace('{{{messageToAI}}}', formData.messageToAI);
  }, [formData]);

  return (
    <div className="fixed inset-0 z-50 bg-black font-code text-[#00FF41] overflow-hidden">
      <style>{`
        @keyframes credits-scroll {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(calc(-100% + 50vh));
          }
        }
        .animate-credits {
          animation: credits-scroll 45s linear forwards;
        }
        /* スクロールバーを隠す */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div className="animate-credits absolute left-0 right-0 px-4 max-w-3xl mx-auto w-full">
        {/* DISCLAIMERS */}
        <div className="mb-16 text-center space-y-4 text-gray-500 text-xs md:text-sm font-sans">
           {DISCLAIMERS.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* PROMPT CONTENT */}
        <div className="mb-16">
            <h3 className="text-center text-yellow-300 mb-6 text-lg border-b border-yellow-300/30 pb-2 mx-auto w-fit tracking-widest">
              CONNECTING TO NEURAL NETWORK...
            </h3>
            <div className="whitespace-pre-wrap text-xs md:text-sm opacity-90 leading-relaxed font-mono text-justify">
                {fullPrompt}
            </div>
        </div>

        {/* LOADING MESSAGE */}
        <div className="text-center pb-8">
            <div className="inline-block text-yellow-300 animate-pulse text-lg md:text-xl font-bold border-2 border-yellow-300 px-6 py-3 rounded bg-yellow-300/10 backdrop-blur-sm">
                AI分析を実行中...
            </div>
            <p className="text-xs text-gray-500 mt-4 tracking-wider">Please wait while we decode your philosophy.</p>
        </div>
      </div>

      {/* For LLMO/SEO - Hidden but accessible content */}
      <div className="sr-only">
        <h2>Process Info</h2>
        <pre>{fullPrompt}</pre>
        <h2>Disclaimers</h2>
        <p>{DISCLAIMERS}</p>
      </div>
    </div>
  );
}
