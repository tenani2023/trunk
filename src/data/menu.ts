/**
 * メニューと料金。すべて仮の料金（デモ）です。
 * 表示ルール: 税込・円、「〜」は「この価格から」。追加料金は note に書く。
 */

export interface MenuItem {
  name: string;
  /** 税込価格（円）。 */
  price: number;
  /** true なら「〜」を付ける（長さ・状態で変動） */
  from?: boolean;
  /** 所要時間の目安（分）。任意 */
  minutes?: number;
  note?: string;
  /** トップの抜粋に載せる */
  featured?: boolean;
}

export interface MenuCategory {
  id: string;
  en: string;
  label: string;
  lead?: string;
  items: MenuItem[];
}

export const menuStatus: 'demo' | 'confirmed' = 'demo';

export const menu: MenuCategory[] = [
  {
    id: 'cut',
    en: 'CUT',
    label: 'カット',
    lead: 'カウンセリング、シャンプー、ブロー込み。',
    items: [
      { name: 'カット', price: 6600, minutes: 60, featured: true },
      { name: 'カット（学生）', price: 5500, minutes: 60, note: '学生証をご提示ください' },
      { name: '前髪カット', price: 1650, minutes: 20 },
      { name: 'メンズカット', price: 6050, minutes: 60, featured: true },
    ],
  },
  {
    id: 'color',
    en: 'COLOR',
    label: 'カラー',
    lead: 'カット別料金。ロング料金は鎖骨下から +¥1,100。',
    items: [
      { name: 'カラー（全体）', price: 8250, from: true, minutes: 90, featured: true },
      { name: 'リタッチ（根元）', price: 6050, minutes: 75 },
      { name: 'グラデーション・ハイライト', price: 12100, from: true, minutes: 150, note: 'ブリーチ回数で変動', featured: true },
      { name: 'ブリーチ（1回）', price: 8800, from: true, minutes: 90 },
    ],
  },
  {
    id: 'perm',
    en: 'PERM',
    label: 'パーマ',
    lead: 'カット別料金。仕上がりの希望によって薬剤を選びます。',
    items: [
      { name: 'パーマ', price: 9350, from: true, minutes: 120, featured: true },
      { name: 'メンズパーマ', price: 8800, from: true, minutes: 100 },
      { name: '縮毛矯正', price: 16500, from: true, minutes: 180, note: 'ロング料金あり' },
    ],
  },
  {
    id: 'treatment',
    en: 'TREATMENT',
    label: 'トリートメント',
    lead: 'カラー・パーマと同日の場合は −¥550。',
    items: [
      { name: 'トリートメント', price: 4400, minutes: 30, featured: true },
      { name: '集中補修トリートメント', price: 7700, minutes: 45 },
      { name: 'ヘッドスパ（20分）', price: 3850, minutes: 20 },
    ],
  },
  {
    id: 'other',
    en: 'OTHER',
    label: 'その他',
    items: [
      { name: 'シャンプー・ブロー', price: 3300, minutes: 30 },
      { name: 'ヘアセット', price: 5500, from: true, minutes: 45 },
      { name: '指名料', price: 550, note: '指名予約の場合' },
    ],
  },
];

export const menuNotes = [
  '表示価格はすべて税込です。',
  '「〜」の付いた価格は、髪の長さ・量・状態によって変動します。カウンセリングで事前にご案内します。',
  'カラー・パーマはカット料金が別途かかります。',
  '初回の方は、仕上がりの希望を伺う時間として +15分ほど見込んでご予約ください。',
];

export const featuredMenu = menu.flatMap((c) => c.items.filter((i) => i.featured).map((i) => ({ ...i, category: c })));

export const formatPrice = (item: Pick<MenuItem, 'price' | 'from'>) =>
  `¥${item.price.toLocaleString('ja-JP')}${item.from ? '〜' : ''}`;
