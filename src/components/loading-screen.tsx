'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import type { GeneratePhilosophicalProfileInput } from '@/ai/flows/generate-philosophical-profile';
import { DISCLAIMERS, FAKE_LOGS, PHILOSOPHICAL_PROFILE_PROMPT } from '@/lib/prompt';
import { cn } from '@/lib/utils';

export function LoadingScreen({
  formData,
}: {
  formData: GeneratePhilosophicalProfileInput;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const [typedPrompt, setTypedPrompt] = useState('');
  const [showDisclaimers, setShowDisclaimers] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullPrompt = useMemo(() => {
    return PHILOSOPHICAL_PROFILE_PROMPT
      .replace('{{join favoriteSongs ", "}}', formData.favoriteSongs.join(', '))
      .replace('{{join favoriteBooks ", "}}', formData.favoriteBooks.join(', '))
      .replace('{{join favoriteWords ", "}}', formData.favoriteWords.join(', '))
      .replace('{{{messageToAI}}}', formData.messageToAI);
  }, [formData]);

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      // 1. Animate logs
      for (let i = 0; i < FAKE_LOGS.length; i++) {
        if (cancelled) return;
        await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 100));
        setLogs((prev) => [...prev, FAKE_LOGS[i]]);
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }

      // 2. Animate prompt typing
      for (let i = 0; i <= fullPrompt.length; i++) {
        if (cancelled) return;
        await new Promise((resolve) => setTimeout(resolve, 5));
        setTypedPrompt(fullPrompt.substring(0, i));
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }
      
      // 3. Show disclaimers
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!cancelled) {
        setShowDisclaimers(true);
      }
    };

    animate();

    return () => {
      cancelled = true;
    };
  }, [fullPrompt]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black p-4 font-code text-[#00FF41]"
    >
      <div className="flex-grow">
        {logs.map((log, i) => (
          <p key={i} className="text-sm">
            <span className="text-gray-500 mr-2">{new Date().toLocaleTimeString()}.{String(Date.now()).slice(-3)} &gt;</span>
            {log}
          </p>
        ))}

        {logs.length === FAKE_LOGS.length && (
          <div className="mt-4">
            <p className="text-sm text-yellow-300">[RAW PROMPT] Sending to Gemini API...</p>
            <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-left select-all">
              {typedPrompt}
              <span className="inline-block h-4 w-2 animate-ping bg-[#00FF41] align-middle"></span>
            </pre>
          </div>
        )}
      </div>

      <div className={cn(
        "absolute inset-0 top-auto h-full w-full overflow-hidden transition-opacity duration-1000",
        showDisclaimers ? "opacity-100" : "opacity-0"
      )}>
        <div className={cn("absolute bottom-0 w-full", showDisclaimers && "scroll-up")}>
          <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-gray-400">
            {DISCLAIMERS.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      
      {/* For LLMO/SEO */}
      <div className="sr-only">
        <h2>生プロンプト</h2>
        <pre>{fullPrompt}</pre>
        <h2>免責事項</h2>
        <p>{DISCLAIMERS}</p>
      </div>
    </div>
  );
}
