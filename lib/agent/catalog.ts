import { hairScore, history, nextReservation, products, salons, weather } from "@/lib/data";
import type { AgentState, Reservation } from "./types";

export const screens: Record<string, string> = {
  "/": "ホーム",
  "/card": "MIRRA CARD",
  "/history": "カルテ",
  "/ai": "AI",
  "/salon": "サロン検索",
  "/profile": "マイページ",
  "/ai/memory": "記憶と会話ログ",
};

export const initialReservation: Reservation = {
  salonId: "luce",
  salon: nextReservation.salon,
  stylist: nextReservation.stylist,
  date: nextReservation.date,
  time: nextReservation.time,
  menu: nextReservation.menu,
};

export const initialState: AgentState = {
  memories: [
    { id: "m1", text: "ブリーチは半年に1回までにしたい", date: "2026-06-12", source: "user" },
    { id: "m2", text: "朝のスタイリングは5分以内で終わらせたい", date: "2026-07-03", source: "agent" },
    { id: "m3", text: "頭皮が敏感なので刺激の強い薬剤は避ける", date: "2026-08-21", source: "agent" },
  ],
  reminders: [{ id: "r1", title: "集中ヘアマスク", when: "毎週日曜 21:00", done: false }],
  cart: [],
  reservation: initialReservation,
  messages: [],
  settings: { nickname: "陽大", voiceReply: true },
};

/** Stable, cacheable description of the app's catalog for the model. */
export function catalogText() {
  const salonLines = salons
    .map((s) => `- id=${s.id} ${s.name} ${s.area} / 得意: ${s.specialties.join("・")} / メニュー: ${s.menus.map((m) => `${m.name}(¥${m.price})`).join("、")} / 営業 ${s.hours}`)
    .join("\n");
  const productLines = products.map((p) => `- id=${p.id} ${p.name}（${p.brand}）¥${p.price} マッチ度${p.match}%`).join("\n");
  const historyLines = history
    .map((h) => `- ${h.date} ${h.menu} @${h.salon} 担当${h.stylist}: ${h.recipe.map((r) => `${r.label}${r.value}`).join(" ")} / ${h.memo}`)
    .join("\n");
  return `## サロン
${salonLines}

## 商品
${productLines}

## カルテ（施術履歴）
${historyLines}

## 髪質
スコア${hairScore.score}（先月比+${hairScore.delta}）/ ダメージ ${hairScore.damage.label} / 乾燥度 ${hairScore.dryness.label} / ${hairScore.hairType}

## 今日の天気
${weather.city} ${weather.temp}℃ 湿度${weather.humidity}% UV${weather.uv}

## 画面
${Object.entries(screens)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}`;
}
