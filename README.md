# MIRRA — Your Beauty, Always With You.

美容室と個人をつなぐ次世代AIビューティープラットフォーム「MIRRA」のインタラクティブ・プロトタイプです。
美容室での施術履歴と日常のホームケアを、ひとつのデータ基盤で管理する体験をデモします（バックエンドなし・ダミーデータ）。

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

デスクトップでは、ブランドパネルと iPhone フレームの中でアプリが表示されます（左パネルから各画面へジャンプ可能）。
モバイルではフルスクリーンのアプリとして動作します（safe-area 対応）。

## Screens

| Route | Screen | Highlights |
| --- | --- | --- |
| `/` | Home | パララックスのヒーロー、天気（気温・湿度・UV）、髪質スコアのリング＆カウントアップ、AIアドバイス、横スクロール商品、次回予約 |
| `/card` | MIRRA CARD | ホログラム箔・オーロラ・ガラス質感のカード。ポインター追従の3Dチルト＆グレア、浮遊アニメーション、タップで3D回転→裏面（QR・髪質・会員情報・サロン連携）、NFC共有デモ、全画面提示モード |
| `/history` | Hair History | Instagram風タイムライン（写真カルーセル・ダブルタップでいいね・保存）、薬剤レシピ、髪質データ（スコア推移チャート＆内訳） |
| `/ai` | AI Concierge | MIRRA AI チャット。初期提案カード、トピックチップ、ストリーミング表示、診断・プラン・商品のリッチ返信 |
| `/salon` | Salon Matching | 検索・現在地取得・得意分野フィルター、AIマッチ率、共有レイアウトアニメーションで詳細へ遷移、メニュー／日時選択→予約完了 |
| `/profile` | Profile | 会員カード表示、利用状況、メニュー（アカウント設定・施術履歴・購入履歴・通知設定・サロン連携・ヘルプ・ログアウト） |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui（`components/ui`）· Framer Motion · Lucide Icons

- Fonts are self-hosted via `@fontsource` (Jost / Cormorant Garamond / Noto Sans JP).
- Design tokens live in `app/globals.css` (`@theme`): `#F7F8FA` background, `rgba(255,255,255,0.75)` glass, `#101828` primary, `#DDE8FF` / `#F6E8FF` accents, 28px radius.
- Dummy data: `lib/data.ts`, AI canned replies: `lib/ai.ts`.

## Project structure

```
app/                 routes (+ template.tsx for page transitions)
components/shell/    device frame, status bar, bottom nav (floating AI FAB), brand panel
components/card/     MIRRA CARD, QR, NFC pulse
components/home/     home sections
components/history/  timeline, carousel, hair data chart
components/salon/    salon detail + booking
components/ai/       AI orb
components/ui/       shadcn-style primitives, motion helpers, product illustrations
```

## Notes

- Photos in `public/images` are placeholder crops derived from the design reference; swap them for production photography.
  Product bottles are drawn as SVG (`components/ui/product-visual.tsx`) so they stay crisp at any size.
- The QR code on the card back is decorative (not scannable).
- Animations respect `prefers-reduced-motion`.
