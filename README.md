# TRUNK — 美容室ブランドサイト（ローカルデモ）

Astro 7 + TypeScript + 独自CSS（CSS変数）で制作した、美容室「TRUNK」のブランドサイトのデモです。
住所・電話・営業時間・ロゴ・スタッフ・料金・予約先・写真はすべて **仮** で、差し替え前提の構造になっています（→ `CONTENT_GUIDE.md`）。

## 必要環境

- Node.js 22.12 以上（確認済み: v22.21.0）
- pnpm 10（確認済み: 10.24.0）。`packageManager` フィールドで固定。

## コマンド

```bash
pnpm install          # 依存関係（sharp / esbuild のビルドは package.json で許可済み）
pnpm dev              # 開発サーバー http://localhost:4321
pnpm check            # astro check（型検査）
pnpm build            # 本番ビルド → dist/
pnpm preview          # dist/ をローカル配信 http://localhost:4321
pnpm verify:links     # dist/ 内の内部リンク・画像・アンカー・noindex を検証
pnpm test:e2e         # Playwright（preview を自動起動。Chromium SP/PC + WebKit SP）
pnpm shots            # 全ページのスクリーンショット（preview 起動中に実行）→ docs/screenshots/
pnpm shots:states     # メニュー展開・200%文字拡大の状態スクリーンショット
pnpm fonts            # フォントCSSの再生成（dev/build 前に自動実行）
node scripts/process-photos.mjs   # 素材写真の再トリミング・グレーディング
node scripts/swap-test.mjs        # 別データへ一時差し替え→ビルド→復元（差し替え設計の確認）
```

Playwright のブラウザが未インストールの場合: `pnpm exec playwright install chromium webkit`

## 構成

```
src/
  data/        site.ts staff.ts menu.ts styles.ts media.ts   ← 差し替え対象はここ
  assets/photos/   最適化前の写真（_raw/ は素材原本）
  components/  Header / Footer / ReserveBar / Photo / Logo / StyleCard / StaffCard …
  layouts/     BaseLayout.astro（フォント・noindex・スクロール出現）
  pages/       index / styles / works（一覧・カテゴリ・詳細）/ staff / staff/[id] / menu / salon / reserve / 404
  content/works/   施術事例（1件 = 1 Markdown。写真は assets/works/）
  styles/      global.css（トークン・タイポグラフィ・レイアウト原始）/ fonts.css（生成物）
public/fonts/  Noto Sans JP のサブセットとCSS（生成物。初回描画後に読み込む）
scripts/       screenshots / verify-links / process-photos / swap-test / build-fonts-css + subset-font.py / r2-*（R2 比較用）
tools/fonts/   Noto Sans JP 可変フォント原本（OFL）— サブセット生成元
tests/         Playwright e2e
docs/          ASSETS.md（素材出典）/ screenshots/ / VERIFICATION.md（検証記録）/ review/r2/（R2 の before/after・比較・レポート）
DESIGN.md      アートディレクションとトークン
CONTENT_GUIDE.md  差し替え手順と公開前チェック
```

## フォントの読み込み方針（R2）

- Instrument Serif（見出し）: バンドルに含め、`<link rel="preload">` で先読み。
- Noto Sans JP（本文）: `scripts/subset-font.py`（Python + fonttools）が **サイトの全文字＋ASCII＋かな＋記号** だけを含む 1 ファイル（約310KB、可変ウェイト）を `public/fonts/noto-sans-jp.<hash>.woff2` に生成します（`pnpm build` / `pnpm dev` の前に自動実行）。初回訪問はシステムの日本語書体で描画し、最初の操作または load+3秒後に低優先度で取得。再訪問は描画前に `font-display: optional` で宣言するのでキャッシュから即適用され、レイアウトシフトは起きません。
- Python / fonttools が無い環境では fontsource の分割版に自動フォールバックします（`pip install fonttools brotli` で有効化）。
- 文章・名前・料金を差し替えたら必ず `pnpm build`（または `pnpm fonts`）でサブセットを再生成してください。

## デモとしての制約

- 全ページ `noindex`。`src/data/site.ts` の `getProductionBlockers()` が空になるまで外れません。
- 予約は送信されません。外部予約URL未設定のため、全「予約する」は `/reserve` の案内ページへ。
- 写真は Unsplash License の素材（`docs/ASSETS.md`）。実店舗・実スタッフ・実施術例ではありません。
- 本番公開・デプロイ・Git push は行っていません（このフォルダは Git 管理外です）。
