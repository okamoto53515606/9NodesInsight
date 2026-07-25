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
import { Search } from 'lucide-react';

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
          {/* 検索結果（常時表示・インラインスクロール） */}
          {hasSearchContext && (
            <div className="rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Google検索による客観情報
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto p-4 text-sm leading-relaxed">
                <MarkdownRenderer content={profile.searchContext} />
              </div>
            </div>
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
