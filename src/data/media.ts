/**
 * 画像の参照テーブル。
 * ページやコンポーネントは画像ファイルを直接 import せず、ここで定義したキーを使います。
 * 写真を差し替えるときは `src/assets/photos/` のファイルを置き換え、必要ならこの表の
 * alt / focus / status を更新するだけで済みます（コンポーネント側の修正は不要）。
 */
import type { ImageMetadata } from 'astro';

import heroPortrait from '../assets/photos/hero-portrait.jpg';
import heroWide from '../assets/photos/hero-wide.jpg';
import conceptHair from '../assets/photos/concept-hair.jpg';
import conceptLight from '../assets/photos/concept-light.jpg';
import styleBob from '../assets/photos/style-bob.jpg';
import styleShortLayer from '../assets/photos/style-short-layer.jpg';
import styleShortFringe from '../assets/photos/style-short-fringe.jpg';
import styleMediumLayer from '../assets/photos/style-medium-layer.jpg';
import styleLong from '../assets/photos/style-long.jpg';
import styleMensPart from '../assets/photos/style-mens-part.jpg';
import styleMensShort from '../assets/photos/style-mens-short.jpg';
import stylePerm from '../assets/photos/style-perm.jpg';
import styleColor from '../assets/photos/style-color.jpg';
import staff01 from '../assets/photos/staff-01.jpg';
import staff02 from '../assets/photos/staff-02.jpg';
import staff03 from '../assets/photos/staff-03.jpg';
import staff04 from '../assets/photos/staff-04.jpg';
import salonMain from '../assets/photos/salon-main.jpg';
import salonMainWide from '../assets/photos/salon-main-wide.jpg';
import salonDetail from '../assets/photos/salon-detail.jpg';
import salonProducts from '../assets/photos/salon-products.jpg';

/** 'demo' = 素材写真（差し替え対象）。'final' = 店舗から提供された正式写真。 */
export type MediaStatus = 'demo' | 'final';

export interface MediaItem {
  src: ImageMetadata;
  alt: string;
  /** CSS aspect-ratio 文字列。レイアウト側の枠の比率（画像は cover で収める） */
  ratio: string;
  /** object-position。スマホ／PCで別々に管理する */
  focus: { mobile: string; desktop: string };
  status: MediaStatus;
  /** 出典メモ（docs/ASSETS.md と対応） */
  source?: string;
}

export const media = {
  heroPortrait: {
    src: heroPortrait,
    alt: '木漏れ日の中、横を向いた人物のレイヤーショート。襟足と毛先の形がはっきり見える。',
    ratio: '4 / 5',
    focus: { mobile: '55% 35%', desktop: '55% 40%' },
    status: 'demo',
    source: 'unsplash:CwDiph-y_TQ',
  },
  heroWide: {
    src: heroWide,
    alt: '明るい屋外の光の中、うつむいた人物のレイヤーショート。',
    ratio: '4 / 3',
    focus: { mobile: '50% 40%', desktop: '50% 40%' },
    status: 'demo',
    source: 'unsplash:B6urSV4bhLA',
  },
  conceptHair: {
    src: conceptHair,
    alt: '逆光に透ける、細くまっすぐな髪の毛先と横顔。',
    ratio: '4 / 5',
    focus: { mobile: '50% 50%', desktop: '50% 50%' },
    status: 'demo',
    source: 'unsplash:0NN4f10YE5g',
  },
  conceptLight: {
    src: conceptLight,
    alt: '窓の光が格子状に落ちる白い壁と、ラタンの椅子。',
    ratio: '3 / 4',
    focus: { mobile: '50% 60%', desktop: '50% 60%' },
    status: 'demo',
    source: 'unsplash:Obm20i8OEX4',
  },
  styleBob: { src: styleBob, alt: '木漏れ日の中の、あごラインで切りそろえたボブ。', ratio: '3 / 4', focus: { mobile: '50% 35%', desktop: '50% 35%' }, status: 'demo', source: 'unsplash:HD6QL8UmnGM' },
  styleShortLayer: { src: styleShortLayer, alt: '明るい屋外の光の中、うつむいた人物のレイヤーショート。', ratio: '3 / 4', focus: { mobile: '50% 35%', desktop: '50% 35%' }, status: 'demo', source: 'unsplash:B6urSV4bhLA' },
  styleShortFringe: { src: styleShortFringe, alt: '短い前髪のショートヘア。街の光の中で微笑む。', ratio: '3 / 4', focus: { mobile: '50% 40%', desktop: '50% 40%' }, status: 'demo', source: 'unsplash:Defp8o9qtJQ' },
  styleMediumLayer: { src: styleMediumLayer, alt: '顔まわりにレイヤーを入れたミディアム。', ratio: '3 / 4', focus: { mobile: '45% 35%', desktop: '45% 35%' }, status: 'demo', source: 'unsplash:-67sdrvMjx4' },
  styleLong: { src: styleLong, alt: '夕方の光を受けた、動きのあるロングヘア。', ratio: '3 / 4', focus: { mobile: '50% 30%', desktop: '50% 30%' }, status: 'demo', source: 'unsplash:p0kwFu51vao' },
  styleMensPart: { src: styleMensPart, alt: 'センターパートのメンズミディアム。', ratio: '3 / 4', focus: { mobile: '50% 30%', desktop: '50% 30%' }, status: 'demo', source: 'unsplash:bm-ySgfMeAc' },
  styleMensShort: { src: styleMensShort, alt: '束感を出したメンズショート。', ratio: '3 / 4', focus: { mobile: '50% 40%', desktop: '50% 40%' }, status: 'demo', source: 'unsplash:n4KewLKFOZw' },
  stylePerm: { src: stylePerm, alt: '細かなカールのパーマスタイル。横顔。', ratio: '3 / 4', focus: { mobile: '50% 40%', desktop: '50% 40%' }, status: 'demo', source: 'unsplash:lxsduAdWXy4' },
  styleColor: { src: styleColor, alt: '毛先にかけて明るくなるグラデーションカラー。', ratio: '3 / 4', focus: { mobile: '50% 35%', desktop: '50% 35%' }, status: 'demo', source: 'unsplash:qMclM6hzlCI' },
  staff01: { src: staff01, alt: 'デモプロフィール用の人物写真（ボブの人物、窓の柔らかい光）', ratio: '4 / 5', focus: { mobile: '50% 40%', desktop: '50% 40%' }, status: 'demo', source: 'unsplash:Phz4l-BWJnY' },
  staff02: { src: staff02, alt: 'デモプロフィール用の人物写真（前髪のあるミディアムヘアの人物、淡い壁）', ratio: '4 / 5', focus: { mobile: '50% 40%', desktop: '50% 40%' }, status: 'demo', source: 'unsplash:kmFsL9-e5bs' },
  staff03: { src: staff03, alt: 'デモプロフィール用の人物写真（眼鏡で笑う人物、白い壁）', ratio: '4 / 5', focus: { mobile: '50% 38%', desktop: '50% 38%' }, status: 'demo', source: 'unsplash:JddS3Gig2kU' },
  staff04: { src: staff04, alt: 'デモプロフィール用の人物写真（ひげの人物、淡い布の背景）', ratio: '4 / 5', focus: { mobile: '50% 40%', desktop: '50% 40%' }, status: 'demo', source: 'unsplash:jhIAP6Le4OY' },
  salonMain: { src: salonMain, alt: '観葉植物と鏡、木の台のあるサロンのセット面。窓からの光。（イメージ写真）', ratio: '4 / 5', focus: { mobile: '50% 50%', desktop: '50% 50%' }, status: 'demo', source: 'unsplash:wmS0POWkVrg' },
  salonMainWide: { src: salonMainWide, alt: '観葉植物と鏡のあるサロンのセット面。（イメージ写真）', ratio: '16 / 10', focus: { mobile: '50% 55%', desktop: '50% 55%' }, status: 'demo', source: 'unsplash:wmS0POWkVrg' },
  salonDetail: { src: salonDetail, alt: '木の天板に置かれたドライヤーと、壁に落ちる午後の光。（イメージ写真）', ratio: '4 / 3', focus: { mobile: '50% 50%', desktop: '50% 50%' }, status: 'demo', source: 'unsplash:QjUsb_ir3II' },
  salonProducts: { src: salonProducts, alt: '鏡の前に並ぶヘアケアプロダクト。（イメージ写真）', ratio: '4 / 5', focus: { mobile: '40% 50%', desktop: '40% 50%' }, status: 'demo', source: 'unsplash:gI9rvJK61L8' },
} as const satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof media;

export const hasDemoMedia = Object.values(media).some((m) => m.status === 'demo');
