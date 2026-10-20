# CONTENT_GUIDE — 実情報への差し替えガイド

このデモは「実情報の差し替え前まで完成した状態」です。
文章・スタッフ・料金・画像・リンクは **`src/data/` と `src/assets/photos/` に集約** されており、ページのコード（`src/pages/`、`src/components/`）を書き換える必要はありません。

## 1. 差し替えファイル一覧

| ファイル | 内容 | 差し替え項目 |
|---|---|---|
| `src/data/site.ts` | 店名・コピー・住所・営業時間・電話・予約URL・SNS・支払い方法 | `brand.tagline` / `brand.lead` / `brand.concept`、`location.*`、`hours.*`、`contact.*` |
| `src/data/staff.ts` | スタッフ4人 | `name` / `kana` / `nameEn` / `role` / `tagline` / `bio` / `specialties` / `nominatable` / `image` / `styleIds` / `isDemo` |
| `src/data/menu.ts` | メニューと料金 | `menu[]` の `items`、`menuNotes`、`menuStatus` |
| `src/data/styles.ts` | スタイル（施術例） | `name` / `category` / `description` / `staffId` / `image` / `featured` / `isDemo` |
| `src/data/media.ts` | 画像の参照・alt・比率・焦点 | 各キーの `src` import 先、`alt`、`focus`、`status` |
| `src/assets/photos/*.jpg` | 写真本体 | 同名ファイルを上書きすれば `media.ts` の変更も最小で済む |
| `scripts/subset-font.py` / `scripts/build-fonts-css.mjs` | 日本語フォントのサブセット生成 | 差し替え後の `pnpm build` で自動再生成。手動は `pnpm fonts` |
| `src/components/Logo.astro` | 仮ロゴ（文字） | 正式ロゴのSVGに中身を置き換える。使用箇所は変更不要 |
| `public/favicon.svg` | ファビコン | 正式ロゴ由来のものに差し替え |

### `status` / `isDemo` の意味

- `site.ts` の各項目は `{ value, status: 'demo' | 'confirmed' }`。**店舗が確認した値を入れたら `status: 'confirmed'` にする。**
- `staff.ts` / `styles.ts` の `isDemo: true` は「デモプロフィール」「素材写真」の表示を出す。実スタッフ・実施術例に差し替えたら `false` に。
- `media.ts` の `status: 'demo'` は素材写真。実写真に置き換えたら `'final'` に。
- `menu.ts` の `menuStatus` を `'confirmed'` にすると「仮の金額」注記が消える。

`site.ts` の `getProductionBlockers()` が **未確認項目を列挙** します。これが空になるまで、全ページに `noindex` と DEMO 表示が付きます。フラグ1つで外れる仕組みにはしていません。

## 2. 必要な写真と推奨画角

すべて `src/assets/photos/` に JPEG で置く（長辺 2000〜2400px、sRGB）。ビルド時に AVIF/WebP と srcset を自動生成します。`public/` に置いても最適化されません。

| ファイル名 | 用途 | 比率 | 推奨 |
|---|---|---|---|
| `hero-portrait.jpg` | トップ主役（SP/PC共通） | 4:5 | **髪型・毛先・質感が主題**になる縦位置（顔は主役でなくてよい）。自然光。文字は重ねないので余白不要。SPでは上下が少し切れる（高さ 46svh）ので主題は中央寄りに |
| `hero-wide.jpg` | 予備（横位置が必要になった場合） | 4:3 | 同上の横位置 |
| `concept-hair.jpg` | 髪の質感ディテール | 4:5 | 毛先・ツヤ・動きが分かる寄り |
| `concept-light.jpg` | 空間の光 | 3:4 | 窓・光・椅子など静物 |
| `style-*.jpg`（6〜9点） | 施術例 | 3:4 | 背景・光・トーンを揃える。正面〜横顔、髪型全体が入る。同じ人物の使い回しは避ける |
| `staff-01..04.jpg` | スタッフ4人 | 4:5 | **4人とも同じ場所（淡い無地の壁）・柔らかい光・胸上の同じ距離で撮る。強い日差しの影を避ける**。頭の幅が枠の40〜45%、目線が枠の上から35〜45%に来るように。上半身、頭上に少し余白 |
| `salon-main.jpg` / `salon-main-wide.jpg` | 内観メイン | 4:5 / 16:10 | セット面と窓の光。人物なしでも可 |
| `salon-detail.jpg` | 内観ディテール | 4:3 | 道具・棚・植物など |
| `salon-products.jpg` | プロダクト | 4:5 | 鏡前や棚 |

写真を差し替えたら `src/data/media.ts` の `alt`（内容説明）と、必要なら `focus`（トリミング時に残す位置。`"50% 30%"` = 横中央・上寄り）を調整してください。素材写真の原本（`_raw/`）と `scripts/process-photos.mjs` は実写真に置き換わった時点で不要です。

## 3. 予約先の設定

`src/data/site.ts`

```ts
export const contact = {
  reserveUrl: 'https://…',   // 外部予約サービス or 自社予約のURL。設定すると全「予約する」がここへ（別タブ）
  phone: '0X-XXXX-XXXX',     // tel: リンクを有効化。null のあいだはリンクにならない
  instagramUrl: '…' | null,
  ...
}
```

- `reserveUrl` が `null` のあいだは、全「予約する」が `/reserve`（予約案内）へ行きます。予約案内の窓口は LINE・Instagram・電話・ホットペッパーの4つで、`contact.lineUrl` / `instagramUrl` / `phone` / `hotpepperUrl` を入れた窓口だけボタンが有効になります（未設定は「準備中」表示）。ホットペッパーを主窓口にするなら `reserveUrl` にも同じURLを入れると、全「予約する」が直接そこへ飛びます。
- LINE・ホットペッパー等、特定サービスは前提にしていません。URLならどれでも可。
- `location.mapUrl` に地図URL（Google Maps の共有リンク等）を入れると、サロンページの地図枠がリンクになります。未確定の住所から地図を生成しないため、デモでは `null` です。

## 4. ロゴ

`src/components/Logo.astro` の中身を SVG に置き換えてください。`size` prop（font-size）を受け取っているので、SVG の場合は `height: var(--logo-size)` で高さに読み替えると全箇所のサイズ指定がそのまま使えます。ヘッダー 24px、ヒーロー約 88〜220px、フッター 72〜168px で使用中。

## 5. 公開前チェックリスト

- [ ] `site.ts` の全項目が `status: 'confirmed'`、`reserveUrl` 設定済み → `getProductionBlockers()` が空
- [ ] `media.ts` の全画像が `status: 'final'`（素材写真が残っていない）
- [ ] `staff.ts` / `styles.ts` の `isDemo: false`、`menu.ts` の `menuStatus: 'confirmed'`
- [ ] 実スタッフ・お客様の写真は掲載許諾を得ている（施術例はお客様の同意）
- [ ] 料金は税込で、「〜」の意味と追加料金の注記が実態と一致
- [ ] `astro.config.mjs` に `site: 'https://…'`（本番オリジン）を設定
- [ ] `noindex` が外れていることを `pnpm build` 後の `dist/index.html` で確認（`isDemo` が false なら自動で外れます）
- [ ] 構造化データ（LocalBusiness）は現在入れていない。必要なら実情報確定後に `BaseLayout.astro` へ追加
- [ ] フォントのライセンス確認（Instrument Serif / Noto Sans JP: SIL OFL 1.1、同梱可。`tools/fonts/OFL-NotoSansJP.txt`）
- [ ] 文章・名前・料金の差し替え後に `pnpm build` を実行し、日本語フォントのサブセット（`public/fonts/noto-sans-jp.<hash>.woff2`）が再生成されていることを確認（未再生成だと新しい漢字だけシステム書体になる）
- [ ] 本番ホスティングで `/fonts/*.woff2` と `/_astro/*` に長期キャッシュ（`Cache-Control: public, max-age=31536000, immutable`）を設定
- [ ] `pnpm check` / `pnpm build` / `pnpm test:e2e` / `pnpm verify:links` がすべて通る
- [ ] 実機（iPhone Safari / Android Chrome）で予約導線・下部バー・メニューを確認（このデモでは未実施）

## 6. 差し替えの動作確認（実施済み）

`scripts/swap-test.mjs` で、別の仮データ（店名・住所・料金・スタッフ名・予約URL・写真1点）に一時的に差し替えてビルドし、ページのコードを触らずに反映されることを確認しています。実行: `node scripts/swap-test.mjs`（終了後に自動で元へ戻します）。

## 7. 施術事例（Works）の投稿

事例は **1件 = 1ファイル**（`src/content/works/<slug>.md`）です。ページのコードを触らずに増やせます。URL は `/works/<slug>`（ファイル名がそのまま URL。英数字とハイフンで）。

1. 写真を `src/assets/works/` に置く（JPEG、3:4 推奨、長辺 2000px 程度）。アフターは必須、ビフォーは任意。
2. `src/content/works/` に既存ファイルをコピーして内容を書き換える。
3. `pnpm build`（本文の新しい漢字が日本語フォントのサブセットに入る）。

```md
---
title: ロングから、乾かすだけで決まるワンレングスボブへ   # 検索される言葉（長さ・施術名）を自然に
category: cut            # cut / color / perm / straight / kids（src/data/works.ts）
tags: [ボブ, 30代]        # 補助の言葉。詳細ページに #タグ として表示
date: 2026-10-08         # 施術日。新しい順に並ぶ
staffId: aoi             # staff.ts の id。null で非表示
lead: 1〜2文の要約。一覧と meta description に使う。
after: ../../assets/works/bob-after.jpg
afterAlt: 写真の説明（検索・読み上げ用）
before: ../../assets/works/bob-before.jpg   # 省略可
beforeAlt: 来店時の状態の説明
menu: [カット]           # menu.ts の品名と一致させると料金・所要時間が自動表示
minutes: 60              # 省略するとメニューの所要時間の合計
concerns: [毛先のパサつき, 乾かす時間を短くしたい]
result: 仕上がりを一言で
featured: true           # トップの「最近の施術事例」に優先して載せる
isDemo: false            # 実際の施術例なら false（true だと DEMO 表示と noindex）
draft: false             # true で非公開
---

## ご要望
## 施術のポイント
## 自宅でのスタイリング
```

- 一覧 `/works`、カテゴリ別 `/works/category/<category>`（「草津 カット」のような検索の受け皿。見出し文は `src/data/works.ts`）、12件を超えると `/works/2` のようにページが分かれます。
- 検索で狙う地名は `src/data/site.ts` の `area`（草津・湖南エリア）。住所とは別に持っています。
- 構造化データ（Article / BreadcrumbList）とパンくずは実装済みですが、**デモ中（`isDemo`）は出力しません**。`astro.config.mjs` に `site` を設定すると canonical / OGP 画像の絶対 URL も出ます。
- お客様の写真は掲載許諾を得てから。顔が写らない構図（後ろ姿・横顔・毛先の寄り）でも事例として成立します。
- **ビフォーとアフターは同じ場所・同じ距離・同じ向きで撮る**（1枚のフレームに重ねて比較するため。背景がずれると継ぎ目が目立ちます）。片方だけでも掲載できます。
