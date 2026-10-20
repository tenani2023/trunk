/**
 * スタイル（施術例）データ。写真はすべてデモ素材で、TRUNKの実際の施術例ではありません。
 */
import type { MediaKey } from './media';

export type StyleCategory = 'SHORT' | 'BOB' | 'MEDIUM' | 'LONG' | "MEN'S" | 'PERM' | 'COLOR';

export const styleCategories: { id: StyleCategory; label: string }[] = [
  { id: 'SHORT', label: 'ショート' },
  { id: 'BOB', label: 'ボブ' },
  { id: 'MEDIUM', label: 'ミディアム' },
  { id: 'LONG', label: 'ロング' },
  { id: "MEN'S", label: 'メンズ' },
  { id: 'PERM', label: 'パーマ' },
  { id: 'COLOR', label: 'カラー' },
];

export interface StyleItem {
  id: string;
  name: string;
  category: StyleCategory;
  description: string;
  /** 担当スタッフID（デモ設定） */
  staffId: string | null;
  image: MediaKey;
  /** トップに載せる6点 */
  featured: boolean;
  /** true = 素材写真（実際の施術例ではない） */
  isDemo: boolean;
}

export const styles: StyleItem[] = [
  {
    id: 'bob',
    name: '木漏れ日のワンレングスボブ',
    category: 'BOB',
    description: 'あごの線で切りそろえ、内側だけ軽く。乾かすだけで面が出ます。',
    staffId: 'aoi',
    image: 'styleBob',
    featured: true,
    isDemo: true,
  },
  {
    id: 'short-layer',
    name: '毛先を遊ばせたレイヤーショート',
    category: 'SHORT',
    description: '襟足と耳まわりを軽くして、動きが出るように。ワックス少量で。',
    staffId: 'aoi',
    image: 'styleShortLayer',
    featured: true,
    isDemo: true,
  },
  {
    id: 'long',
    name: '夕方の光のロング',
    category: 'LONG',
    description: '重さを残したまま、顔まわりだけ薄く。風が抜ける長さです。',
    staffId: 'rin',
    image: 'styleLong',
    featured: true,
    isDemo: true,
  },
  {
    id: 'mens-part',
    name: 'センターパートのメンズミディアム',
    category: "MEN'S",
    description: '前髪を伸ばして真ん中で分ける。サイドは軽く、後ろは少し重く。',
    staffId: 'yuto',
    image: 'styleMensPart',
    featured: true,
    isDemo: true,
  },
  {
    id: 'color',
    name: '毛先へ抜けるグラデーションカラー',
    category: 'COLOR',
    description: '根元は地毛のまま、毛先に向かって明るく。伸びても気にならない設計。',
    staffId: 'rin',
    image: 'styleColor',
    featured: true,
    isDemo: true,
  },
  {
    id: 'perm',
    name: '細かなカールのナチュラルパーマ',
    category: 'PERM',
    description: 'ロッドを細めに。濡れた髪に少しオイルをつけて、自然乾燥でも決まります。',
    staffId: 'yuto',
    image: 'stylePerm',
    featured: true,
    isDemo: true,
  },
  {
    id: 'short-fringe',
    name: '短い前髪のショート',
    category: 'SHORT',
    description: '眉の上で切った前髪と、耳にかかる長さのサイド。表情が主役になります。',
    staffId: 'aoi',
    image: 'styleShortFringe',
    featured: false,
    isDemo: true,
  },
  {
    id: 'medium-layer',
    name: '顔まわりレイヤーのミディアム',
    category: 'MEDIUM',
    description: '鎖骨の長さに、顔まわりだけレイヤーを。結んでも下ろしても。',
    staffId: 'rin',
    image: 'styleMediumLayer',
    featured: false,
    isDemo: true,
  },
  {
    id: 'mens-short',
    name: '束感のあるメンズショート',
    category: "MEN'S",
    description: 'トップに長さを残し、指で散らすだけで束が出るように。',
    staffId: 'yuto',
    image: 'styleMensShort',
    featured: false,
    isDemo: true,
  },
];

export const featuredStyles = styles.filter((s) => s.featured);
export const getStyle = (id: string) => styles.find((s) => s.id === id);
export const getStylesByStaff = (staffId: string) => styles.filter((s) => s.staffId === staffId);
