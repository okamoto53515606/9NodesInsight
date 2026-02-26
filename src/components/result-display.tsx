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

export function ResultDisplay({
  profile,
  onReset,
}: {
  profile: string;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">
              あなたの哲学プロファイル
            </CardTitle>
          </div>
          <CardDescription>
            入力された10項目から抽出された、あなたの深層構造です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card p-6 shadow-inner">
            <MarkdownRenderer content={profile} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onReset} className="w-full" size="lg" variant="outline">
            もう一度プロファイリングする
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
