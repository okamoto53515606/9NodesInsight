'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { GeneratePhilosophicalProfileInput } from '@/ai/flows/generate-philosophical-profile';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from './icons';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  song1: z.string().min(1, '入力は必須です。'),
  song2: z.string().min(1, '入力は必須です。'),
  song3: z.string().min(1, '入力は必須です。'),
  book1: z.string().min(1, '入力は必須です。'),
  book2: z.string().min(1, '入力は必須です。'),
  book3: z.string().min(1, '入力は必須です。'),
  word1: z.string().min(1, '入力は必須です。'),
  word2: z.string().min(1, '入力は必須です。'),
  word3: z.string().min(1, '入力は必須です。'),
  messageToAI: z
    .string()
    .min(1, '入力は必須です。')
    .max(200, '200文字以内で入力してください。'),
});

type FormValues = z.infer<typeof formSchema>;

const formFields: {
  category: 'song' | 'book' | 'word';
  label: string;
  example?: string;
  keys: (keyof FormValues)[];
  placeholders: string[];
}[] = [
  {
    category: 'song',
    label: '好きな曲',
    example: '（例）Vaundy「怪獣の花唄」',
    keys: ['song1', 'song2', 'song3'],
    placeholders: ['アーティスト名「曲名」', '好きな曲 2', '好きな曲 3'],
  },
  {
    category: 'book',
    label: '好きな本',
    example: '（例）東野圭吾「白鳥とコウモリ」',
    keys: ['book1', 'book2', 'book3'],
    placeholders: ['著者名「書籍名」', '好きな本 2', '好きな本 3'],
  },
  {
    category: 'word',
    label: '好きな言葉',
    keys: ['word1', 'word2', 'word3'],
    placeholders: ['好きな言葉 1', '好きな言葉 2', '好きな言葉 3'],
  },
];

export function InputForm({
  onSubmit,
}: {
  onSubmit: (data: GeneratePhilosophicalProfileInput) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      song1: '',
      song2: '',
      song3: '',
      book1: '',
      book2: '',
      book3: '',
      word1: '',
      word2: '',
      word3: '',
      messageToAI: '',
    },
  });

  const { isSubmitting } = form.formState;

  function handleFormSubmit(values: FormValues) {
    const inputForAI: GeneratePhilosophicalProfileInput = {
      favoriteSongs: [values.song1, values.song2, values.song3],
      favoriteBooks: [values.book1, values.book2, values.book3],
      favoriteWords: [values.word1, values.word2, values.word3],
      messageToAI: values.messageToAI,
    };
    onSubmit(inputForAI);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">
              9Nodes Insight
            </CardTitle>
          </div>
          <CardDescription>
            10個の入力から、あなたの深層にある「構造の哲学」をプロファイリングします。
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <CardContent className="space-y-8">
              {formFields.map(({ category, label, keys, placeholders, example }) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-lg text-primary">{label}</h3>
                    {example && (
                      <span className="text-sm text-muted-foreground">{example}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {keys.map((key, index) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">{`${label} ${
                              index + 1
                            }`}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={placeholders[index]}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <FormField
                control={form.control}
                name="messageToAI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-lg text-primary">
                      AIへの一言
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="AIに伝えたいメッセージを自由にご記入ください。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                プロファイリングを開始
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
