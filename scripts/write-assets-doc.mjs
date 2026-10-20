// Regenerates docs/ASSETS.md from the Unsplash metadata saved next to each original.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const dir = 'src/assets/photos/_raw';
const use = {
  'B6urSV4bhLA': 'スタイル SHORT（レイヤー）※R2ではヒーロー',
  '0NN4f10YE5g': 'コンセプト（髪の質感）※R1ではヒーロー',
  'p0kwFu51vao': 'スタイル LONG',
  'HD6QL8UmnGM': 'スタイル BOB',
  'CwDiph-y_TQ': 'ヒーロー（hero-portrait / hero-wide）※R2-F1で採用。R2まではスタイル SHORT',
  'Defp8o9qtJQ': 'スタイル SHORT（前髪）',
  '-67sdrvMjx4': 'スタイル MEDIUM',
  'bm-ySgfMeAc': "スタイル MEN'S（センターパート）",
  'lxsduAdWXy4': 'スタイル PERM',
  'qMclM6hzlCI': 'スタイル COLOR',
  'n4KewLKFOZw': "スタイル MEN'S（ショート）",
  'hZMfmBuCRkw': '未使用（R1・R2ではスタッフ01）',
  'HjxY9EE9eVY': '未使用（R2ではスタッフ02）',
  'kmFsL9-e5bs': 'スタッフ デモプロフィール 02 ※R2-F1で採用',
  'G9f4Enb8XVM': '未使用（R1ではスタッフ02）',
  'c7ZHoJXQsC4': '未使用（R2ではスタッフ03）',
  'JddS3Gig2kU': 'スタッフ デモプロフィール 03 ※R2-F1で採用',
  'Gu_YcFSAulI': '未使用（R1ではスタッフ03）',
  'OFSQ6bHjFjs': '未使用（R2ではスタッフ04）',
  'jhIAP6Le4OY': 'スタッフ デモプロフィール 04 ※R2-F1で採用',
  '8HYnWP4MRGQ': '未使用（R1ではスタッフ04）',
  'wmS0POWkVrg': 'サロン（メイン）',
  'QjUsb_ir3II': 'サロン（ディテール）',
  'gI9rvJK61L8': 'サロン（プロダクト）',
  'N6DAg3r5YFc': '未使用（R1ではコンセプト）',
  'Obm20i8OEX4': 'コンセプト（光）',
  '0b_7r_dNjFs': '未使用（R2-F1 候補として保存）',
  'iGzHMzRZjRs': '未使用（R2-F1 候補として保存）',
  'ZIRCZUqvl0g': '未使用（R2-F1 候補として保存）',
  'QGECZ9lT8F0': '未使用（R2-F1 候補として保存）',
  '7Wg6tmPGbWQ': '未使用（候補として保存）',
  'OuxJHYeUYpk': '未使用（候補として保存）',
  'EIk0I03OrEo': '未使用（候補として保存）',
  'Phz4l-BWJnY': 'スタッフ デモプロフィール 01 ※R2-F1で採用',
};

let md = `# 素材出典記録（ASSETS）

取得日: 2026-09-29（R2・R2-F1 追加分も同日）　取得元: Unsplash（https://unsplash.com）

## ライセンス

すべて Unsplash License（https://unsplash.com/license）で提供されている写真です。商用・非商用を問わず無償で利用・改変でき、許諾や表記は必須ではありません（表記は推奨）。

## 権利の区分

| 区分 | 状態 |
|---|---|
| 写真の著作権ライセンス | Unsplash License で利用・改変可（表記推奨）。本表の全点。 |
| 被写体の肖像権・パブリシティ権 | **未確認・未取得。** Unsplash 利用規約 §5 のとおり、写った人物・ブランド・著作物の許諾は別途必要になり得る。デモ表示（イメージ／デモプロフィール）でのみ使用し、公開前に実写真へ差し替える。 |
| 写り込み（商品・ロゴ・店名等） | 個別未確認。 |

**注意: Unsplash License は写真そのものの利用許諾であり、被写体の肖像権・パブリシティ権、写り込んだ商標の使用許諾は含みません。** 本デモでは「架空のスタイル例」「デモプロフィール」「店舗イメージ（実店舗ではない）」としてのみ使用し、公開前に実店舗・実スタッフの写真へ差し替える前提です（CONTENT_GUIDE.md 参照）。人物写真をそのまま本番で「当店スタッフ」「当店の施術例」として掲載することは想定していません。

取得方法: 各写真ページの Download 機能（\`https://unsplash.com/photos/{id}/download\`）で保存し、原本を \`src/assets/photos/_raw/\` に保持しています。ホットリンクや実行時のランダム画像サービスには依存していません。

## 加工内容

\`scripts/process-photos.mjs\` にて次を実施:

1. 用途ごとの縦横比（ヒーロー 4:5 / 4:3、スタイル 3:4、スタッフ 4:5、サロン 4:5 / 16:10 / 4:3）にトリミング
2. 2000〜2400px 幅にリサイズ
3. 全写真共通の軽いグレーディング（彩度 −5〜−22%、ごくわずかな暖色ティント、必要に応じ明度 ±4%）
4. JPEG（品質 88）で \`src/assets/photos/\` に出力

ビルド時に Astro の画像サービス（sharp）が AVIF / WebP と srcset を生成します。

## 一覧

| Unsplash ID | 作者 | 元ページ | 元サイズ | 用途 |
|---|---|---|---|---|
`;

for (const f of readdirSync(dir).filter((f) => f.endsWith('.meta.json'))) {
  const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
  const id = f.replace('.meta.json', '');
  md += `| ${id} | ${j.user.name} (@${j.user.username}) | ${j.links.html} | ${j.width}×${j.height} | ${use[id] ?? ''} |\n`;
}

md += `
## フォント

- Instrument Serif（SIL Open Font License 1.1）— \`@fontsource/instrument-serif\` 経由でセルフホスト。見出し・ワードマーク用。
- Noto Sans JP（SIL Open Font License 1.1）— \`@fontsource-variable/noto-sans-jp\` 経由でセルフホスト。unicode-range で分割されたサブセットのみが読み込まれます。

## 参考サイトについて

参考サイト（iLe / GALA / TRACE）の写真・ロゴ・文章・装飾は一切使用していません。調査記録は DESIGN.md を参照。
`;

writeFileSync('docs/ASSETS.md', md);
console.log('docs/ASSETS.md written');
