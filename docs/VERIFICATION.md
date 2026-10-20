# 検証記録（VERIFICATION）

実施日: 2026-09-29　環境: Windows 11 / Node 22.21.0 / pnpm 10.24.0 / Astro 7.3.5 / Playwright 1.63.0 / Lighthouse 13.5.0
対象: `pnpm build` の成果物を `astro preview`（http://127.0.0.1:4322）で配信したもの。

## 実施したもの

| 項目 | 方法 | 結果 |
|---|---|---|
| 型検査 | `pnpm check`（astro check, 33 files） | 0 errors / 0 warnings |
| 本番ビルド | `pnpm build` | 11 ページ生成。画像は AVIF/WebP/JPEG の srcset を生成（dist 46MB） |
| 内部リンク・画像・アンカー | `pnpm verify:links`（dist を走査） | 952 参照すべて解決。外部URL 0。全ページに noindex。構造化データなし |
| E2E | `pnpm test:e2e`（Chromium 390px / Chromium 1440px / WebKit 390px） | 54 passed / 3 skipped（WebKit の Tab キー仕様による skip 1、PC幅でのモバイルメニュー系 skip 2） |
| 差し替え設計 | `node scripts/swap-test.mjs` | 店名・住所・料金・スタッフ名・予約URL・ヒーロー写真を別データに一時差し替え → ページコード無変更で反映を確認 → 復元。PASSED |
| スクリーンショット | `pnpm shots`（360/375/390/430/768/1024/1440/1920px, Chromium）+ WebKit 390/1440 + 状態（メニュー展開、200%拡大） | `docs/screenshots/` に 82 枚。横スクロール 0px、コンソールエラー 0（/404 の意図的な 404 応答のみ） |
| 視覚レビュー | 全ページのフル画像を実際に開いて確認・修正（ヒーロー構図、写真の色、スタッフ4人の揃い、料金リスト、フッター、タブレット幅のヒーロー高さ、1024px のワードマーク改行など） | 修正済み |
| Lighthouse（モバイル、simulate 既定） | `lighthouse --preset=perf --form-factor=mobile` | 下表 |
| Lighthouse（モバイル、devtools throttling） | 同上 `--throttling-method=devtools` | 下表 |
| Lighthouse（デスクトップ） | `--preset=desktop` | Performance 99 / A11y 100 / Best Practices 100、LCP 0.8s、CLS 0 |

### Lighthouse モバイル（レポートは `docs/lighthouse/`）

| ページ | 方式 | Perf | A11y | BP | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| / | simulate | 97 | 100 | 100 | 1.1s | 2.5s | 0 | 0ms |
| / | devtools | 99 | – | – | 1.4s | 1.8s | 0.004 | 40ms |
| /menu | simulate | 96 | 100 | 100 | 0.8s | 2.7s | 0 | 0ms |
| /menu | devtools | 100 | – | – | 1.1s | 1.1s | 0.002 | 30ms |
| /staff | simulate | 95 | 100 | 100 | 0.8s | 2.9s | 0 | 0ms |
| /staff | devtools | 100 | – | – | 1.1s | 1.7s | 0.002 | 20ms |

**注意:** これはローカルの preview サーバーに対するラボ計測です。本番の Core Web Vitals（実ユーザー75パーセンタイル）合格を意味しません。公開後に CrUX / Search Console で確認が必要です。

### 性能のために行ったこと

- ヒーロー画像を `<link rel="preload" imagesrcset>` で先読み、`fetchpriority="high"`、非遅延。他画像は lazy。
- 全画像に width/height（固有サイズ）と `aspect-ratio` 枠 → 画像による CLS 0。
- CSS はインライン化（外部 CSS の往復なし）。
- 見出し書体 Instrument Serif は preload。ローカル代替（Georgia / Times）に `size-adjust` を実測値で設定し、フォント切替時の再折返しを抑制（CLS 0.15 → 0.00x）。
- 日本語本文 Noto Sans JP（約120サブセット、~500KB）は **window.load 後に読み込み、`font-display: optional`**。初回はシステム日本語書体で描画、2回目以降にキャッシュから適用。
- 全 font-size を rem 化（ブラウザの文字サイズ設定・200%拡大に追従）。

## 未実施・制約

- **実機検証は未実施。** iPhone Safari / Android Chrome の実機では確認していません。WebKit の結果は Playwright のエミュレーションであり、iPhone 実機 Safari の検証ではありません。
- 参考サイトは HTML/CSS の解析のみで、**レンダリング画面のスクリーンショットは撮っていません**。GALA は HTTPS 証明書不一致のため HTTP のみ取得。
- スクリーンリーダー（VoiceOver / NVDA）での読み上げ確認は未実施。見出し構造・alt・ラベルは Lighthouse a11y 100 とコード上で確認。
- 高さの小さい画面（例: 横向き 667×375）は CSS 上 `100svh` 固定に依存しない設計にしていますが、スクリーンショットは撮っていません。
- Codex は利用可能でしたが、今回は使用していません（実装・レビューはすべて本セッション内）。
- 画像生成機能は使用していません。写真はすべて Unsplash からの素材（`docs/ASSETS.md`）。

## スクリーンショットの見方

`docs/screenshots/{page}-{browser}-{width}.png`。page は top / styles / staff / staff-aoi / menu / salon / reserve / 404。
状態: `menu-open-chromium-390.png`（全画面メニュー）、`top-zoom200-chromium-390.png`（200% 文字拡大）。
キャプチャは再訪問（Webフォントがキャッシュ済み）の状態です。初回訪問の描画（システム書体）を撮るには `pnpm shots -- --cold`。


---

# R2 追記（2026-09-29）

R2（視覚品質の向上）の検証記録は `docs/review/r2/R2_REPORT.md` にまとめました。要点:

- 参考サイトは Playwright Chromium で実表示（iLe / TRACE 取得成功、GALA は証明書エラーで未確認）。`docs/review/r2/refs/`
- 変更前後を同条件（390×844@2x / 375×667@2x / 1440×900@1x、コールド／ウォーム、フォント遮断、JS無効）で撮影。`docs/review/r2/before/`, `after/`, 比較は `compare/`
- Lighthouse モバイル simulate 3回: / LCP 2.18s（Perf 99）、/staff 1.50s（100）、/menu 1.20s（100）、CLS 0。devtools throttling: 1.1〜1.7s
- `pnpm check` 0 errors、`pnpm test:e2e` 54 passed / 3 skipped、`verify:links` 全解決、`swap-test` PASSED（フォントサブセット再生成を含む）
- 初回訪問（システム書体）と再訪問（Noto Sans JP キャッシュ適用）を `document.fonts` の状態で実測: 初回 applied=false、再訪 true
- 未実施: 実機、スクリーンリーダー、GALA 実画面

`docs/screenshots/` は R2 後の状態で撮り直し済み（R1 時点の82枚は `docs/review/r2/baseline/r1-screenshots/` に保存）。


---

# R2-F1 追記（2026-09-29）

限定仕上げ（ヒーロー写真の再選定、スタッフ4人の撮影条件統一、スマホの重複 CTA と固定バー、紹介文）の記録は `docs/review/r2-f1/R2F1_REPORT.md` と `regression.txt`。check 0 errors、e2e 54 passed / 3 skipped、verify:links 全解決、swap-test PASSED、トップ Lighthouse モバイル simulate 3回 LCP 2.03s / Perf 99。`docs/screenshots/` は R2-F1 後の状態で撮り直し。
