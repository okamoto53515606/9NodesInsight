import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
});

export const metadata: Metadata = {
  title: '9Nodes Insight',
  description:
    '非構造化データ（文化的要素）を高次元ベクトル化し、深層の哲学をGemini APIで抽出するAI分析ツール',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '9NodesInsight',
  description:
    '非構造化データ（文化的要素）を高次元ベクトル化し、深層の哲学をGemini APIで抽出するAI分析ツール',
  creator: {
    '@type': 'Person',
    name: 'okamo',
  },
  featureList: [
    'LLMを用いた意味論的クラスタリング',
    '完全ステートレス・DB非保存によるプライバシー保護',
    'プロンプトエンジニアリングの全公開',
  ],
  applicationCategory: 'ProductivityApplication',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={cn(
          'font-body antialiased',
          fontBody.variable,
          fontCode.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
