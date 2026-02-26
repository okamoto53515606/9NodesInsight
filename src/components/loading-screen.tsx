'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import type { GeneratePhilosophicalProfileInput } from '@/ai/flows/generate-philosophical-profile';
import { DISCLAIMERS, FAKE_LOGS, PHILOSOPHICAL_PROFILE_PROMPT } from '@/lib/prompt';

export function LoadingScreen({
  formData,
}: {
  formData: GeneratePhilosophicalProfileInput;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const [typedPrompt, setTypedPrompt] = useState('');
  const [promptDone, setPromptDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullPrompt = useMemo(() => {
    return PHILOSOPHICAL_PROFILE_PROMPT
      .replace('{{#each favoriteSongs}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}', formData.favoriteSongs.join(', '))
      .replace('{{#each favoriteBooks}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}', formData.favoriteBooks.join(', '))
      .replace('{{#each favoriteWords}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}', formData.favoriteWords.join(', '))
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

      // Wait a bit before showing prompt stuff
      await new Promise(res => setTimeout(res, 500));
      if (cancelled) return;


      // 2. Animate prompt typing
      setPromptDone(false);
      for (let i = 0; i <= fullPrompt.length; i++) {
        if (cancelled) return;
        await new Promise((resolve) => setTimeout(resolve, 5));
        setTypedPrompt(fullPrompt.substring(0, i));
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }
      
      // 3. Finish up
      if (!cancelled) {
        setPromptDone(true);
      }
    };

    animate();

    return () => {
      cancelled = true;
    };
  }, [fullPrompt]);

  const showPromptArea = logs.length === FAKE_LOGS.length;

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

        {showPromptArea && (
          <>
            <div className="mt-8 text-sm text-gray-400 space-y-2">
              {DISCLAIMERS.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-sm text-yellow-300">[RAW PROMPT] Sending to Gemini API...</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-left select-all">
                {typedPrompt}
                {!promptDone && <span className="inline-block h-4 w-2 animate-ping bg-[#00FF41] align-middle"></span>}
              </pre>
            </div>
            {promptDone && (
                 <div className="mt-8 text-center text-yellow-300 animate-pulse">
                    AIによる分析を実行中です。しばらくお待ちください...
                </div>
            )}
          </>
        )}
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
