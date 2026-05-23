'use client';

export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="prose prose-invert max-w-none space-y-4 text-left leading-relaxed">
      {lines.map((line, index) => {
        if (line.startsWith('## ')) {
          return (
            <h2
              key={index}
              className="text-2xl font-bold text-primary !mt-8 !mb-4 border-b border-primary/50 pb-2"
            >
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith('#### ')) {
          return (
            <h4 key={index} className="text-lg font-semibold !mt-6 !mb-2">
              {line.substring(5)}
            </h4>
          );
        }
        if (line.trim() === '') {
          return <div key={index} className="h-4" />;
        }
        return (
          <p key={index} className="text-foreground/90">
            {line}
          </p>
        );
      })}
    </div>
  );
}
