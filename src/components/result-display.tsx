'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MarkdownRenderer } from './markdown-renderer';
import { Logo } from './icons';
import { Search, ChevronDown } from 'lucide-react';

export function ResultDisplay({
  profile,
  onReset,
}: {
  profile: GeneratePhilosophicalProfileOutput;
  onReset: () => void;
}) {
  const hasSearchContext =
    profile.searchContext &&
    profile.searchContext.trim().length > 0 &&
    !profile.searchContext.includes('取得できませんでした');

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">
              あなたのプロファイリング結果
            </CardTitle>
          </div>
          <CardDescription>
            入力された10項目から抽出された、あなたの深層構造です。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 検索結果（折りたたみ） */}
          {hasSearchContext && (
            <details className="group rounded-lg border bg-muted/30">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors list-none">
                <Search className="h-4 w-4" />
                <span>Google検索による客観情報</span>
                <ChevronDown className="h-4 w-4 ml-auto transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 pt-0 border-t">
                <div className="mt-3 max-h-64 overflow-y-auto rounded bg-background p-3 text-sm leading-relaxed">
                  <MarkdownRenderer content={profile.searchContext} />
                </div>
              </div>
            </details>
          )}

          {/* プロフィール本体 */}
          <div className="rounded-lg border bg-card p-6 shadow-inner">
            <MarkdownRenderer content={profile.profile} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onReset} className="w-full" size="lg" variant="outline">
            もう一度分析する
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
