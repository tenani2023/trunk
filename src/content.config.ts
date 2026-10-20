/**
 * コンテンツコレクション。
 * works: 施術事例。src/content/works/<slug>.md（frontmatter + 本文）。写真は src/assets/works/ に置き、
 *        frontmatter から相対パスで参照する（ビルド時に AVIF/WebP と srcset を自動生成）。
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { workCategoryIds } from './data/works';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      /** 見出し。検索される言葉（長さ・施術名）を自然に含める */
      title: z.string(),
      category: z.enum(workCategoryIds),
      /** 補助の言葉（例: ボブ, 前下がり, 30代）。詳細ページに表示し、検索の手がかりにする */
      tags: z.array(z.string()).default([]),
      /** 施術日（公開順もこの日付） */
      date: z.coerce.date(),
      /** 担当スタッフ ID（staff.ts）。未設定なら表示しない */
      staffId: z.string().nullable().default(null),
      /** 1〜2文の要約。一覧と meta description に使う */
      lead: z.string(),
      after: image(),
      afterAlt: z.string(),
      /** ビフォー写真は任意。無い事例はアフターだけで載る */
      before: image().optional(),
      beforeAlt: z.string().optional(),
      /** 施術メニュー（menu.ts の品名と一致させると料金・所要時間を自動表示） */
      menu: z.array(z.string()).default([]),
      /** 所要時間の目安（分）。menu から引けない場合に手で入れる */
      minutes: z.number().optional(),
      /** 来店時の髪の状態・お悩み */
      concerns: z.array(z.string()).default([]),
      /** 仕上がりを一言で */
      result: z.string().optional(),
      /** トップに載せる候補（新しい順に 4 件） */
      featured: z.boolean().default(false),
      /** true = 素材写真によるデモ事例（実際の施術例ではない）。本番では false にする */
      isDemo: z.boolean().default(false),
      /** true の間は公開しない */
      draft: z.boolean().default(false),
    }),
});

export const collections = { works };
