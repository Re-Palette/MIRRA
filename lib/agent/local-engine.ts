import { products, salons, weather, hairScore } from "@/lib/data";
import { replyFor } from "@/lib/ai";
import type { AgentAction, AgentReply, AgentSnapshot } from "./types";

/**
 * Rule-based stand-in for the Claude agent so the demo works without an API key.
 * Mirrors the real agent's contract: returns text + in-app actions.
 */
export function localAgent(input: string, s: AgentSnapshot): AgentReply {
  const t = input.replace(/\s+/g, "");
  const name = s.nickname;
  const reply = (text: string, actions: AgentAction[] = []): AgentReply => ({ text, actions, source: "demo" });

  // --- memory ---
  if (/(覚えて|おぼえて|記憶して|メモして)/.test(t)) {
    const fact = input
      .replace(/(を|って|と)?(覚えて|おぼえて|記憶して|メモして)(おいて|おいてください|ください|ね|といて|て)?[。!！]*/g, "")
      .replace(/^(MIRRA|ミラ)[、,\s]*/i, "")
      .trim();
    if (!fact) return reply("何を覚えておけばよいでしょうか。");
    return reply(`承知しました。「${fact}」を記憶しました。今後の提案に反映します。`, [{ type: "remember", text: fact }]);
  }
  if (/(忘れて|わすれて|消して).*(記憶|こと)|記憶.*(消|削除)|(忘れて|わすれて)/.test(t)) {
    const hit = s.memories.find((m) => t.includes(m.text.slice(0, 4)));
    if (!hit) return reply("どの記憶を消しましょうか。「記憶を見せて」で一覧を表示できます。", [{ type: "navigate", to: "/ai/memory" }]);
    return reply(`「${hit.text}」を記憶から削除しました。`, [{ type: "forget", id: hit.id }]);
  }
  if (/(覚えてる|覚えている|記憶).*(こと|何|なに|一覧|見せ)|何を覚え/.test(t)) {
    if (!s.memories.length) return reply("まだ何も記憶していません。気になることがあれば「〜を覚えて」と話しかけてください。");
    return reply(`${name}さんについて、現在${s.memories.length}件を記憶しています。\n${s.memories.map((m) => `・${m.text}`).join("\n")}`, [
      { type: "navigate", to: "/ai/memory" },
    ]);
  }

  // --- reservations ---
  if (/予約/.test(t) && /(キャンセル|取り消|とりけ|やめ)/.test(t)) {
    if (!s.reservation) return reply("現在、キャンセルできる予約はありません。");
    const r = s.reservation;
    return reply(`${r.date} ${r.time}〜 ${r.salon} のご予約をキャンセルします。よろしければ承認してください。`, [{ type: "cancel_reservation" }]);
  }
  if (/予約/.test(t) && /(して|取って|とって|入れて|いれて|したい|お願い|変更|ずらし)/.test(t)) {
    const salon = salons.find((x) => t.toLowerCase().includes(x.name.toLowerCase()) || t.includes(x.area)) ?? salons.find((x) => x.id === s.reservation?.salonId) ?? salons[0];
    const menu = salon.menus.find((m) => t.includes(m.name))?.name ?? guessMenu(t) ?? salon.menus[0].name;
    const date = parseDate(t) ?? addDays(new Date(), 7);
    const time = parseTime(t) ?? "14:00";
    return reply(
      `承知しました。${salon.name} ${salon.area}で ${date} ${time}〜「${menu}」の枠を確保できます。カルテは自動で共有されます。予約を確定してよろしいですか。`,
      [{ type: "book_salon", salonId: salon.id, menu, date, time }],
    );
  }
  if (/予約/.test(t)) {
    if (!s.reservation) return reply("現在、予約は入っていません。サロンを探しましょうか。", [{ type: "navigate", to: "/salon" }]);
    const r = s.reservation;
    return reply(`次回のご予約は ${r.date} ${r.time}〜、${r.salon}（担当 ${r.stylist}）で「${r.menu}」です。`);
  }

  // --- reminders ---
  if (/(リマインド|思い出させ|通知して|知らせて|アラーム)/.test(t)) {
    const when = parseReminderTime(t);
    const title = /マスク/.test(t) ? "集中ヘアマスク" : /オイル/.test(t) ? "ヘアオイルを塗る" : /予約/.test(t) ? "サロン予約の確認" : /カラー|リタッチ/.test(t) ? "根元リタッチの予約" : "ヘアケア";
    return reply(`了解です。${when}に「${title}」をお知らせします。`, [{ type: "set_reminder", title, when }]);
  }

  // --- shopping ---
  if (/(カート|買って|購入|注文|ほしい|欲しい)/.test(t)) {
    const p = products.find((x) => t.includes(x.name) || t.includes(x.name.replace(/^(ライト|リペア|モイスチャー)/, ""))) ?? (/(オイル)/.test(t) ? products[0] : /(トリートメント)/.test(t) ? products[1] : /(シャンプー)/.test(t) ? products[2] : null);
    if (!p) return reply("どの商品をカートに入れましょうか。今の髪質に合うものを表示します。", [{ type: "show_products", productIds: products.slice(0, 3).map((x) => x.id) }]);
    return reply(`${p.name}（¥${p.price.toLocaleString()}）をカートに追加しました。`, [{ type: "add_to_cart", productId: p.id }]);
  }

  // --- navigation ---
  const nav: [RegExp, string, string][] = [
    [/(カード|会員証|QR)/, "/card", "MIRRA CARD"],
    [/(カルテ|履歴|施術記録)/, "/history", "カルテ"],
    [/(サロン|美容室).*(探|検索|見せ|開)/, "/salon", "サロン検索"],
    [/(マイページ|プロフィール|設定)/, "/profile", "マイページ"],
  ];
  for (const [re, to, label] of nav) {
    if (re.test(t) && /(開|見せ|出して|表示|行って|探)/.test(t)) return reply(`${label}を開きます。`, [{ type: "navigate", to }]);
  }

  // --- briefing ---
  if (/(おはよう|ブリーフィング|今日.*(どう|髪|ケア|予定)|調子)/.test(t)) return reply(briefing(s));

  // --- fallback: beauty consultation ---
  const r = replyFor(input);
  const actions: AgentAction[] = [];
  if (r.plan) actions.push({ type: "show_plan", title: "おすすめのプラン", steps: r.plan });
  if (r.products) actions.push({ type: "show_products", productIds: r.products.map((p) => p.id) });
  return reply(r.text, actions);
}

export function briefing(s: AgentSnapshot) {
  const lines = [
    `おはようございます、${s.nickname}さん。`,
    `東京は${weather.temp}℃、湿度${weather.humidity}%。広がりやすいので、軽めのオイルで毛先をまとめるのがおすすめです。`,
    `髪質スコアは${hairScore.score}、先月より${hairScore.delta}ポイント改善しています。`,
  ];
  if (s.reservation) {
    const [, m, d] = s.reservation.date.split(".").map(Number);
    lines.push(`次回のご予約は${m}月${d}日の${s.reservation.time}、${s.reservation.salon}です。`);
  }
  const open = s.reminders.filter((r) => !r.done);
  if (open.length) lines.push(`リマインダーが${open.length}件あります。「${open[0].title}」${open[0].when}。`);
  return lines.join("");
}

function guessMenu(t: string) {
  if (/カラー|染め|リタッチ/.test(t)) return "ケアカラー";
  if (/カット|切/.test(t)) return "カット";
  if (/ブリーチ/.test(t)) return "ケアブリーチ";
  if (/縮毛|ストレート/.test(t)) return "縮毛矯正";
  if (/トリートメント|髪質改善/.test(t)) return "髪質改善トリートメント";
  if (/スパ/.test(t)) return "ヘッドスパ";
  return null;
}

const fmt = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return fmt(x);
}
const WEEK = "日月火水木金土";

export function parseDate(t: string): string | null {
  const now = new Date();
  if (/明後日|あさって/.test(t)) return addDays(now, 2);
  if (/明日|あした/.test(t)) return addDays(now, 1);
  if (/今日|きょう/.test(t)) return fmt(now);
  const md = t.match(/(\d{1,2})[\/月](\d{1,2})日?/);
  if (md) {
    const d = new Date(now.getFullYear(), Number(md[1]) - 1, Number(md[2]));
    if (d < now) d.setFullYear(d.getFullYear() + 1);
    return fmt(d);
  }
  const wd = t.match(/(来週|今週)?の?([日月火水木金土])曜/);
  if (wd) {
    const target = WEEK.indexOf(wd[2]);
    if (wd[1] === "来週") {
      const toNextMonday = (8 - now.getDay()) % 7 || 7;
      return addDays(now, toNextMonday + ((target + 6) % 7));
    }
    return addDays(now, (target - now.getDay() + 7) % 7 || 7);
  }
  if (/来週/.test(t)) return addDays(now, 7);
  return null;
}

export function parseTime(t: string): string | null {
  const hm = t.match(/(\d{1,2}):(\d{2})/);
  if (hm) return `${hm[1].padStart(2, "0")}:${hm[2]}`;
  const h = t.match(/(午後|夜|夕方)?(\d{1,2})時(半)?/);
  if (h) {
    let hour = Number(h[2]);
    if (h[1] && hour < 12) hour += 12;
    return `${String(hour).padStart(2, "0")}:${h[3] ? "30" : "00"}`;
  }
  return null;
}

function parseReminderTime(t: string) {
  const time = parseTime(t);
  const date = parseDate(t);
  if (/毎週/.test(t)) {
    const wd = t.match(/([日月火水木金土])曜/);
    return `毎週${wd ? wd[1] + "曜" : "日曜"} ${time ?? "21:00"}`;
  }
  if (/毎日|毎晩|毎朝/.test(t)) return `毎日 ${time ?? (/朝/.test(t) ? "07:30" : "21:00")}`;
  if (date || time) return `${date ?? "今日"} ${time ?? "21:00"}`;
  if (/夜|今晩|今夜/.test(t)) return "今日 21:00";
  return "今日 21:00";
}
