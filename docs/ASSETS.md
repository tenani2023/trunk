# 素材出典記録（ASSETS）

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

取得方法: 各写真ページの Download 機能（`https://unsplash.com/photos/{id}/download`）で保存し、原本を `src/assets/photos/_raw/` に保持しています。ホットリンクや実行時のランダム画像サービスには依存していません。

## 加工内容

施術事例（`src/assets/works/`、3:4、`node scripts/process-photos.mjs works`）のビフォー／アフターは**別人物の素材写真**の組み合わせで、実際の施術前後ではありません。各事例は `isDemo: true` で、ページ上にその旨を表示しています。


`scripts/process-photos.mjs` にて次を実施:

1. 用途ごとの縦横比（ヒーロー 4:5 / 4:3、スタイル 3:4、スタッフ 4:5、サロン 4:5 / 16:10 / 4:3）にトリミング
2. 2000〜2400px 幅にリサイズ
3. 全写真共通の軽いグレーディング（彩度 −5〜−22%、ごくわずかな暖色ティント、必要に応じ明度 ±4%）
4. JPEG（品質 88）で `src/assets/photos/` に出力

ビルド時に Astro の画像サービス（sharp）が AVIF / WebP と srcset を生成します。

## 一覧

| Unsplash ID | 作者 | 元ページ | 元サイズ | 用途 |
|---|---|---|---|---|
| -67sdrvMjx4 | Le Thanh Son (@notoriousfan3012) | https://unsplash.com/photos/a-young-girl-holding-a-plant-in-her-hands--67sdrvMjx4 | 3168×3960 | スタイル MEDIUM |
| 0b_7r_dNjFs | Valeria Lendel (@lendel) | https://unsplash.com/photos/a-woman-with-long-black-hair-standing-in-front-of-a-wall-0b_7r_dNjFs | 4860×7289 | 施術事例 STRAIGHT（アフター） |
| 0NN4f10YE5g | Sou Jest (@soujest) | https://unsplash.com/photos/woman-in-pink-shirt-looking-away-0NN4f10YE5g | 5504×8256 | コンセプト（髪の質感）※R1ではヒーロー |
| 7Wg6tmPGbWQ | Jackson Chou (@leadragon249) | https://unsplash.com/photos/man-wearing-black-shirt-7Wg6tmPGbWQ | 3264×4928 | 未使用（候補として保存） |
| 8HYnWP4MRGQ | Cord Allman (@cordallman) | https://unsplash.com/photos/young-man-in-white-t-shirt-against-a-bamboo-wall-8HYnWP4MRGQ | 3456×4320 | 施術事例 PERM メンズ（ビフォー） |
| B6urSV4bhLA | René Porter (@reneporter) | https://unsplash.com/photos/woman-in-white-top-B6urSV4bhLA | 3648×5472 | スタイル SHORT（レイヤー）※R2ではヒーロー／施術事例 CUT ショート（アフター） |
| bm-ySgfMeAc | Davide Aracri (@davieees) | https://unsplash.com/photos/a-young-man-standing-on-the-side-of-a-road-bm-ySgfMeAc | 4160×5536 | スタイル MEN'S（センターパート）／施術事例 CUT メンズ（アフター） |
| c7ZHoJXQsC4 | Declan Sun (@declansun) | https://unsplash.com/photos/a-man-leans-against-a-wall-arms-crossed-c7ZHoJXQsC4 | 6263×9395 | 未使用（R2ではスタッフ03） |
| CwDiph-y_TQ | Dynamic Wang (@dynamicwang) | https://unsplash.com/photos/woman-in-white-eyelet-top-CwDiph-y_TQ | 5842×8789 | ヒーロー（hero-portrait / hero-wide）※R2-F1で採用。R2まではスタイル SHORT |
| Defp8o9qtJQ | Andra C Taylor Jr (@taylormadeglobal) | https://unsplash.com/photos/a-close-up-of-a-person-wearing-a-necklace-Defp8o9qtJQ | 5446×4000 | スタイル SHORT（前髪） |
| EIk0I03OrEo | Natalya Shmeleva (@shmelik) | https://unsplash.com/photos/a-round-mirror-reflecting-a-wooden-structure-EIk0I03OrEo | 2769×4162 | 未使用（候補として保存） |
| G9f4Enb8XVM | Yunming Wang (@ymwang) | https://unsplash.com/photos/a-woman-with-long-black-hair-standing-in-front-of-a-building-G9f4Enb8XVM | 3726×5589 | 施術事例 CUT ショート（ビフォー） |
| gI9rvJK61L8 | Giorgio Trovato (@giorgiotrovato) | https://unsplash.com/photos/black-and-silver-office-rolling-chair-beside-mirror-gI9rvJK61L8 | 5760×3840 | サロン（プロダクト） |
| Gu_YcFSAulI | Le Thanh Son (@notoriousfan3012) | https://unsplash.com/photos/a-man-with-a-tie-and-glasses-is-posing-for-a-picture-Gu_YcFSAulI | 3168×4752 | 未使用（R1ではスタッフ03） |
| HD6QL8UmnGM | Juan Eduardo Montalvo (@montalv00) | https://unsplash.com/photos/woman-with-bob-haircut-in-park-HD6QL8UmnGM | 4160×6240 | スタイル BOB／施術事例 CUT ボブ（アフター） |
| HjxY9EE9eVY | Rizky Sabriansyah (@rizkysabriansyah) | https://unsplash.com/photos/woman-in-white-shirt-standing-near-brown-wall-HjxY9EE9eVY | 3456×5184 | 施術事例 STRAIGHT（ビフォー） |
| hZMfmBuCRkw | Zac Taheriyan (@zacoovic) | https://unsplash.com/photos/a-young-woman-with-short-brown-hair-rests-her-head-hZMfmBuCRkw | 3648×5472 | 施術事例 KIDS（アフター） |
| iGzHMzRZjRs | Jorge Salvador (@jsshotz) | https://unsplash.com/photos/man-in-white-crew-neck-shirt-iGzHMzRZjRs | 3632×5456 | 施術事例 CUT メンズ（ビフォー） |
| JddS3Gig2kU | Le Thanh Son (@notoriousfan3012) | https://unsplash.com/photos/a-young-man-wearing-glasses-and-a-tie-JddS3Gig2kU | 3168×4752 | スタッフ デモプロフィール 03 ※R2-F1で採用 |
| jhIAP6Le4OY | Lucas Calloch (@dreiimos) | https://unsplash.com/photos/a-man-with-a-beard-smiling-at-the-camera-jhIAP6Le4OY | 5304×7952 | スタッフ デモプロフィール 04 ※R2-F1で採用 |
| kmFsL9-e5bs | Rizky Sabriansyah (@rizkysabriansyah) | https://unsplash.com/photos/woman-in-white-collared-shirt-kmFsL9-e5bs | 4000×6000 | スタッフ デモプロフィール 02 ※R2-F1で採用 |
| lxsduAdWXy4 | ALMA (@almas_) | https://unsplash.com/photos/a-woman-with-long-curly-hair-standing-in-front-of-a-wall-lxsduAdWXy4 | 3648×4841 | スタイル PERM／施術事例 PERM（アフター） |
| n4KewLKFOZw | Imansyah Muhamad Putera (@imansyahmp) | https://unsplash.com/photos/boys-face-close-up-photography-n4KewLKFOZw | 3456×3456 | スタイル MEN'S（ショート） |
| N6DAg3r5YFc | Juan Pablo (@who0ne) | https://unsplash.com/photos/back-of-a-persons-head-with-curly-highlighted-hair-N6DAg3r5YFc | 3840×2560 | 施術事例 COLOR ハイライト（アフター） |
| Obm20i8OEX4 | Yi Wei (@shotbyyi) | https://unsplash.com/photos/a-chair-sitting-next-to-a-window-in-a-room-Obm20i8OEX4 | 3448×5168 | コンセプト（光） |
| OFSQ6bHjFjs | Hà Nguyễn (@lavinhha) | https://unsplash.com/photos/smiling-man-in-white-shirt-OFSQ6bHjFjs | 4360×6535 | 施術事例 PERM メンズ（アフター） |
| OuxJHYeUYpk | panitan punpuang (@panitan) | https://unsplash.com/photos/woman-in-black-shirt-smiling-OuxJHYeUYpk | 3648×5472 | 施術事例 COLOR グラデーション（ビフォー） |
| p0kwFu51vao | Eryk Piotr Munk (@piotrmunk) | https://unsplash.com/photos/young-woman-with-dark-hair-looking-left-in-warm-sunlight-p0kwFu51vao | 4672×7008 | スタイル LONG |
| Phz4l-BWJnY | Felicia Varzari (@feliciafelicia) | https://unsplash.com/photos/young-woman-with-short-brown-hair-backlit-by-sun-Phz4l-BWJnY | 3024×4032 | スタッフ デモプロフィール 01 ※R2-F1で採用 |
| QGECZ9lT8F0 | Rizky Sabriansyah (@rizkysabriansyah) | https://unsplash.com/photos/woman-in-white-crew-neck-shirt-QGECZ9lT8F0 | 3456×5184 | 施術事例 CUT ボブ（ビフォー） |
| QjUsb_ir3II | Giorgio Trovato (@giorgiotrovato) | https://unsplash.com/photos/a-hair-dryer-sitting-on-top-of-a-wooden-table-QjUsb_ir3II | 2880×1920 | サロン（ディテール） |
| qMclM6hzlCI | Adi Probo (@adiprobo) | https://unsplash.com/photos/woman-in-blue-denim-jacket-qMclM6hzlCI | 4016×6016 | スタイル COLOR／施術事例 COLOR グラデーション（アフター） |
| wmS0POWkVrg | Mathias Reding (@matreding) | https://unsplash.com/photos/a-plant-in-a-room-wmS0POWkVrg | 4150×6225 | サロン（メイン） |
| ZIRCZUqvl0g | Hannah Popowski (@h_popowski) | https://unsplash.com/photos/a-woman-is-posing-for-a-picture-with-her-hand-on-her-chin-ZIRCZUqvl0g | 4000×6000 | 施術事例 PERM（ビフォー） |

## フォント

- Instrument Serif（SIL Open Font License 1.1）— `@fontsource/instrument-serif` 経由でセルフホスト。見出し・ワードマーク用。
- Noto Sans JP（SIL Open Font License 1.1）— `@fontsource-variable/noto-sans-jp` 経由でセルフホスト。unicode-range で分割されたサブセットのみが読み込まれます。

## 参考サイトについて

参考サイト（iLe / GALA / TRACE）の写真・ロゴ・文章・装飾は一切使用していません。調査記録は DESIGN.md を参照。
