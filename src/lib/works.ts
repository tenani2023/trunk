/**
 * 施術事例の取得・整形。ページからはここを通す（getCollection を直接呼ばない）。
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { menu, type MenuItem } from '@/data/menu';
import type { WorkCategoryId } from '@/data/works';

export type Work = CollectionEntry<'works'>;

let cache: Work[] | null = null;

/** 公開中の事例を新しい順に */
export async function getWorks(): Promise<Work[]> {
  if (!cache) {
    const all = await getCollection('works', ({ data }) => !data.draft);
    cache = all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }
  return cache;
}

export const getWorksByCategory = async (id: WorkCategoryId) => (await getWorks()).filter((w) => w.data.category === id);

/** 同カテゴリの他の事例（足りなければ新しいものを足す） */
export async function getRelatedWorks(work: Work, limit = 3): Promise<Work[]> {
  const all = (await getWorks()).filter((w) => w.id !== work.id);
  const same = all.filter((w) => w.data.category === work.data.category);
  const rest = all.filter((w) => w.data.category !== work.data.category);
  return [...same, ...rest].slice(0, limit);
}

/** menu.ts から品名で引く（料金・所要時間の表示用） */
export function findMenuItem(name: string): (MenuItem & { categoryId: string }) | undefined {
  for (const c of menu) {
    const item = c.items.find((i) => i.name === name);
    if (item) return { ...item, categoryId: c.id };
  }
  return undefined;
}

/** 所要時間の目安。frontmatter の minutes が優先、無ければメニューの合計 */
export function workMinutes(work: Work): number | null {
  if (work.data.minutes) return work.data.minutes;
  const sum = work.data.menu.reduce((n, name) => n + (findMenuItem(name)?.minutes ?? 0), 0);
  return sum > 0 ? sum : null;
}

/** 料金の目安（メニューの合計）。「〜」付きの品があれば合計にも付ける */
export function workPrice(work: Work): { price: number; from: boolean } | null {
  const items = work.data.menu.map(findMenuItem).filter((i): i is NonNullable<typeof i> => !!i);
  if (!items.length) return null;
  return { price: items.reduce((n, i) => n + i.price, 0), from: items.some((i) => i.from) };
}

export const formatWorkDate = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
