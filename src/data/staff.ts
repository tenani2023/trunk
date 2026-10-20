/**
 * スタッフ4人。すべてデモプロフィール（氏名・役職・紹介は仮、写真は素材写真）。
 * 実スタッフ情報が届いたら、この配列の中身と写真キーを差し替える。
 */
import type { MediaKey } from './media';

export interface StaffMember {
  id: string;
  /** 表示名（仮名） */
  name: string;
  /** よみ（ひらがな） */
  kana: string;
  /** 欧文表記 */
  nameEn: string;
  /** 役職はデモ設定。実際の資格・役職は未確認。 */
  role: string;
  /** 一言（トップ・一覧用） */
  tagline: string;
  /** 紹介文（詳細用、2〜3文） */
  bio: string[];
  /** 得意なこと（仮） */
  specialties: string[];
  /** 指名予約の可否（デモ設定） */
  nominatable: boolean;
  image: MediaKey;
  /** 関連するスタイルID（styles.ts） */
  styleIds: string[];
  /** true の間は「デモプロフィール」表示が付く */
  isDemo: boolean;
}

export const staff: StaffMember[] = [
  {
    id: 'aoi',
    name: '水野 あおい',
    kana: 'みずの あおい',
    nameEn: 'Aoi Mizuno',
    role: 'スタイリスト',
    tagline: '短い髪に、らしさを。',
    bio: [
      'ショートとボブを中心に、乾かすだけで形になる骨格に沿ったカットを組み立てます。',
      '「短くしたいけれど不安」という相談から始まることが多いです。似合う長さを一緒に見つけましょう。',
    ],
    specialties: ['ショート', 'ボブ', '骨格に合わせたカット'],
    nominatable: true,
    image: 'staff01',
    styleIds: ['bob', 'short-layer', 'short-fringe'],
    isDemo: true,
  },
  {
    id: 'rin',
    name: '高橋 りん',
    kana: 'たかはし りん',
    nameEn: 'Rin Takahashi',
    role: 'スタイリスト',
    tagline: '色は、肌と服と光の三つで決めます。',
    bio: [
      'カラーとロングのデザインを担当。派手にしすぎず、光が当たったときに気づく程度の変化が好きです。',
      '髪への負担を考えながら、数ヶ月先の状態まで見て提案します。',
    ],
    specialties: ['カラー', 'ロング', 'ダメージを抑えた施術設計'],
    nominatable: true,
    image: 'staff02',
    styleIds: ['color', 'long', 'medium-layer'],
    isDemo: true,
  },
  {
    id: 'yuto',
    name: '小林 ゆうと',
    kana: 'こばやし ゆうと',
    nameEn: 'Yuto Kobayashi',
    role: 'スタイリスト',
    tagline: '朝の五分で決まる髪を、目指しています。',
    bio: [
      'メンズカットとパーマを中心に。スタイリング剤に頼らなくても収まる、質感のある形を大切にしています。',
      '仕事や学校での見え方も考えて、清潔感と遊びのバランスを一緒に決めます。',
    ],
    specialties: ['メンズ', 'パーマ', '質感を活かすカット'],
    nominatable: true,
    image: 'staff03',
    styleIds: ['mens-part', 'mens-short', 'perm'],
    isDemo: true,
  },
  {
    id: 'kanata',
    name: '石井 かなた',
    kana: 'いしい かなた',
    nameEn: 'Kanata Ishii',
    role: 'アシスタント',
    tagline: 'シャンプーの時間が、いちばん好きです。',
    bio: [
      'シャンプーとトリートメント、カラーの補助を担当しています。',
      '頭皮の状態や髪の乾き方を見て、家でのケアの相談にも乗ります。',
    ],
    specialties: ['シャンプー', 'トリートメント', 'ホームケアの相談'],
    nominatable: false,
    image: 'staff04',
    styleIds: [],
    isDemo: true,
  },
];

export const getStaff = (id: string) => staff.find((s) => s.id === id);
