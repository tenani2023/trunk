/**
 * 店舗・ブランド・営業情報・外部リンク・デモ設定。
 *
 * 「未提供」の実情報は null で保持します（架空のURLや電話番号を入れない）。
 * 各項目の `status` は 'demo'（仮値）/ 'confirmed'（店舗確認済み）で、
 * 'demo' が1つでも残っていると noindex と DEMO 表示が外れません。
 */
import { hasDemoMedia } from './media';

export type Status = 'demo' | 'confirmed';

export interface Confirmable<T> {
  value: T;
  status: Status;
}

export const brand = {
  name: 'TRUNK',
  /** 日本語での業態表記。「美容室」は確定。 */
  kind: '美容室',
  /** 仮のブランドコピー（差し替え可） */
  tagline: '自然体なのに、印象に残る。',
  /** ヒーロー直下の短い説明。長いポエムにしない。 */
  lead: '4人の小さなサロン。髪の質感と、あなたの普段着に似合う形を、いっしょに探します。',
  /** メタディスクリプション */
  description:
    '美容室 TRUNK。自然体なのに、印象に残る。4人の小さなサロンです。（現在はデモサイトです。店舗情報・料金・写真はすべて仮のものです）',
  /** コンセプト文（2文まで） */
  concept: [
    'トレンドをなぞるより、その人の骨格と髪質、毎朝の手間に合う形を。',
    '光の入る静かな席で、普段どおりの自分が少しだけ好きになる時間を。',
  ],
} as const;

export const location = {
  /** 住所は未提供。表示用の伏せ字を保持する。 */
  postal: { value: '〒000-0000', status: 'demo' } satisfies Confirmable<string>,
  address: { value: '○○県○○市○○ 0-0-0 ○○ビル 1F', status: 'demo' } satisfies Confirmable<string>,
  access: { value: '○○線 ○○駅 徒歩○分', status: 'demo' } satisfies Confirmable<string>,
  /** 住所確定後に Google Maps 等のURLを入れる。デモでは null（地図は表示しない）。 */
  mapUrl: null as string | null,
} as const;

/**
 * 検索で狙うエリア（施術事例の見出し・説明文・構造化データに使う）。
 * 住所（location）とは別管理。住所が確定しても、ここは「狙う地名」として残す。
 */
export const area = {
  pref: '滋賀県',
  city: '草津市',
  cityShort: '草津',
  region: '湖南エリア',
  nearby: ['栗東市', '守山市', '野洲市', '大津市'],
} as const;

export const hours = {
  weekdays: { value: '10:00 – 19:00', status: 'demo' } satisfies Confirmable<string>,
  weekends: { value: '9:00 – 18:00', status: 'demo' } satisfies Confirmable<string>,
  lastEntry: { value: 'カット 18:00 / カラー・パーマ 17:00', status: 'demo' } satisfies Confirmable<string>,
  closed: { value: '毎週火曜・第2水曜', status: 'demo' } satisfies Confirmable<string>,
} as const;

export const contact = {
  /** 電話番号は未提供。tel: リンクは張らない。 */
  phone: null as string | null,
  phoneDisplay: { value: '000-000-0000（デモ表示）', status: 'demo' } satisfies Confirmable<string>,
  /** 外部予約URL（Hot Pepper Beauty、minimo、自社予約など）。未設定なら /reserve へ誘導。 */
  reserveUrl: null as string | null,
  /** 予約の窓口は LINE・Instagram・電話・ホットペッパーの4つ。URL が入ると /reserve のボタンが有効になる */
  lineUrl: null as string | null,
  instagramUrl: null as string | null,
  hotpepperUrl: null as string | null,
  /** 支払い方法は未確認 */
  payment: { value: ['現金', 'クレジットカード', '電子マネー・QR決済'], status: 'demo' } satisfies Confirmable<readonly string[]>,
} as const;

/** 本番公開のために確認が必要な項目。空になるまで noindex / DEMO表示を維持する。 */
export function getProductionBlockers(): string[] {
  const blockers: string[] = [];
  const check = (label: string, c: Confirmable<unknown>) => {
    if (c.status !== 'confirmed') blockers.push(label);
  };
  check('住所', location.address);
  check('郵便番号', location.postal);
  check('アクセス', location.access);
  check('営業時間（平日）', hours.weekdays);
  check('営業時間（土日祝）', hours.weekends);
  check('最終受付', hours.lastEntry);
  check('定休日', hours.closed);
  check('電話番号', contact.phoneDisplay);
  check('支払い方法', contact.payment);
  if (contact.reserveUrl === null) blockers.push('予約先URL');
  if (hasDemoMedia) blockers.push('写真（デモ素材が残っています）');
  return blockers;
}

/**
 * 画面上の DEMO 表示（タグ・注記）を出すか。false でも noindex と差し替え設計（isDemo）はそのまま。
 * 関係者には「デモである」ことを伝えているため、表示は止めている。
 */
export const showDemoNotes = false;

export const productionBlockers = getProductionBlockers();
/** true の間はデモ扱い（noindex、DEMO表示、予約は送信されない） */
export const isDemo = productionBlockers.length > 0;

export const nav = [
  { href: '/styles', label: 'スタイル', en: 'Styles' },
  { href: '/works', label: '施術事例', en: 'Works' },
  { href: '/staff', label: 'スタッフ', en: 'People' },
  { href: '/menu', label: 'メニュー・料金', en: 'Menu' },
  { href: '/salon', label: 'サロン・アクセス', en: 'Salon' },
  { href: '/reserve', label: '予約について', en: 'Reserve' },
] as const;

/** 予約リンクの行き先。外部URLが設定されているときだけ外部へ。 */
export const reserveHref = contact.reserveUrl ?? '/reserve';
export const reserveIsExternal = contact.reserveUrl !== null;
