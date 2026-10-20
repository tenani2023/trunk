/**
 * 施術事例（Works）のカテゴリと SEO 文言。
 * 事例そのものは src/content/works/*.md（1ファイル = 1事例）。投稿手順は CONTENT_GUIDE.md。
 *
 * このファイルは astro:content に依存しない（content.config.ts から読むため）。
 * 事例の取得は src/lib/works.ts。
 */

export const workCategoryIds = ['cut', 'color', 'perm', 'straight', 'kids'] as const;
export type WorkCategoryId = (typeof workCategoryIds)[number];

export interface WorkCategory {
  id: WorkCategoryId;
  en: string;
  label: string;
  /** 一覧ページの見出し直下の一文 */
  lead: string;
  /** 一覧ページの meta description 兼 導入文。地名を含める */
  description: string;
  /** 事例詳細の「メニュー」から /menu の該当カテゴリへ飛ぶ */
  menuId: string;
}

export const workCategories: WorkCategory[] = [
  {
    id: 'cut',
    en: 'CUT',
    label: 'カット',
    lead: '骨格と髪質、毎朝の手間に合わせて切ります。',
    description:
      '滋賀県草津市の美容室 TRUNK のカット事例。ショート・ボブ・ミディアム・ロング・メンズまで、乾かすだけで形になる骨格に沿ったカットをビフォーアフターで掲載しています。',
    menuId: 'cut',
  },
  {
    id: 'color',
    en: 'COLOR',
    label: 'カラー',
    lead: '肌と服と光の三つで、色を決めます。',
    description:
      '滋賀県草津市の美容室 TRUNK のヘアカラー事例。グラデーション、ハイライト、透明感のあるブラウンなど、伸びても気にならない設計のカラーをビフォーアフターで掲載しています。',
    menuId: 'color',
  },
  {
    id: 'perm',
    en: 'PERM',
    label: 'パーマ',
    lead: 'スタイリング剤に頼らない、質感のあるカール。',
    description:
      '滋賀県草津市の美容室 TRUNK のパーマ事例。ナチュラルなウェーブからメンズのニュアンスパーマまで、乾かすだけで決まるパーマをビフォーアフターで掲載しています。',
    menuId: 'perm',
  },
  {
    id: 'straight',
    en: 'STRAIGHT',
    label: '縮毛矯正・ストレート',
    lead: '広がりとうねりを、自然なまっすぐに。',
    description:
      '滋賀県草津市の美容室 TRUNK の縮毛矯正・ストレート事例。根元だけ、前髪だけの矯正など、髪への負担を抑えた施術をビフォーアフターで掲載しています。',
    menuId: 'perm',
  },
  {
    id: 'kids',
    en: 'KIDS',
    label: 'キッズカット',
    lead: '座っていられる時間で、きれいに。',
    description:
      '滋賀県草津市の美容室 TRUNK のキッズカット事例。はじめての美容室でも短時間で終わるカットを掲載しています。親子でのご来店も歓迎です。',
    menuId: 'cut',
  },
];

export const getWorkCategory = (id: WorkCategoryId) => workCategories.find((c) => c.id === id)!;

export const worksPath = (page = 1) => (page > 1 ? `/works/${page}` : '/works');
export const workCategoryPath = (id: WorkCategoryId, page = 1) => (page > 1 ? `/works/category/${id}/${page}` : `/works/category/${id}`);
export const workPath = (slug: string) => `/works/${slug}`;

/** 一覧の 1 ページあたりの件数 */
export const WORKS_PER_PAGE = 12;
