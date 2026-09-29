"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Bell, BrainCircuit, Check, ChevronLeft, Download, Plus, Trash2, UserRound } from "lucide-react";
import { useAgent } from "@/components/agent/agent-provider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { AgentState } from "@/lib/agent/types";
import { cn } from "@/lib/utils";

type Tab = "memory" | "reminders" | "log";

export default function MemoryPage() {
  const { state, dispatch, hydrated } = useAgent();
  const [tab, setTab] = useState<Tab>("memory");
  const [draft, setDraft] = useState("");

  const days = useMemo(() => {
    const map = new Map<string, typeof state.messages>();
    for (const m of state.messages) {
      const key = new Date(m.ts).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
      map.set(key, [...(map.get(key) ?? []), m]);
    }
    return [...map.entries()].reverse();
  }, [state.messages]);

  return (
    <main className="pb-36">
      <header className="px-5 pb-4 pt-[max(env(safe-area-inset-top),16px)] lg:pt-[60px]">
        <Link href="/ai" className="glass inline-grid size-10 place-items-center rounded-full" aria-label="AIに戻る">
          <ChevronLeft className="size-5" strokeWidth={1.5} />
        </Link>
        <p className="mt-5 text-[10.5px] tracking-[0.34em] text-ink-muted">AGENT BRAIN</p>
        <div className="flex items-end justify-between">
          <h1 className="font-jp text-[24px] tracking-[0.06em]">記憶と会話ログ</h1>
          <button
            onClick={() => download(state)}
            className="font-jp flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[11px] text-ink-soft shadow-soft"
          >
            <Download className="size-3.5" />
            Markdown
          </button>
        </div>
        <p className="font-jp mt-2 text-[12px] leading-[1.8] text-ink-soft">MIRA は会話の中であなたについて学び、提案に反映します。間違っている記憶は削除できます。</p>
      </header>

      {/* profile / settings */}
      <section className="glass mx-4 rounded-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[12px] bg-[linear-gradient(135deg,#eef2ff,#f7efff)]">
            <UserRound className="size-[17px]" strokeWidth={1.5} />
          </span>
          <label className="font-jp flex-1 text-[13px]" htmlFor="nickname">
            呼び名
          </label>
          <input
            id="nickname"
            value={state.settings.nickname}
            onChange={(e) => dispatch({ t: "settings", patch: { nickname: e.target.value.slice(0, 12) } })}
            className="font-jp w-28 rounded-full bg-white/80 px-3 py-1.5 text-right text-[13px] outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mt-3 flex items-center gap-3 border-t border-ink/5 pt-3">
          <span className="grid size-9 place-items-center rounded-[12px] bg-[linear-gradient(135deg,#eef2ff,#f7efff)]">
            <AudioLines className="size-[17px]" strokeWidth={1.5} />
          </span>
          <span className="font-jp flex-1 text-[13px]">音声で返答する</span>
          <Switch checked={state.settings.voiceReply} onCheckedChange={(v) => dispatch({ t: "settings", patch: { voiceReply: v } })} label="音声で返答する" />
        </div>
      </section>

      <div className="mx-4 mt-5">
        <div className="glass relative grid grid-cols-3 rounded-full p-1" role="tablist">
          {(
            [
              ["memory", "記憶", state.memories.length],
              ["reminders", "リマインダー", state.reminders.filter((r) => !r.done).length],
              ["log", "会話ログ", state.messages.length],
            ] as const
          ).map(([key, label, n]) => (
            <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className="relative h-10 rounded-full text-[12px]">
              {tab === key && <motion.span layoutId="brain-tab" className="absolute inset-0 rounded-full bg-ink" />}
              <span className={cn("font-jp relative transition-colors", tab === key ? "text-white" : "text-ink-muted")}>
                {label}
                {hydrated && <span className="ml-1 tabular-nums opacity-60">{n}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 px-4">
        <AnimatePresence mode="wait">
          {tab === "memory" && (
            <motion.div key="memory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  dispatch({ t: "addMemory", text: draft.trim(), source: "user" });
                  setDraft("");
                }}
                className="glass flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="自分で書き足す（例：パーマは苦手）"
                  aria-label="記憶を追加"
                  className="font-jp h-9 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-muted"
                />
                <button type="submit" aria-label="追加" className="grid size-9 place-items-center rounded-full bg-ink text-white">
                  <Plus className="size-4" />
                </button>
              </form>
              <AnimatePresence initial={false}>
                {[...state.memories].reverse().map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="glass flex items-start gap-3 rounded-[22px] p-4"
                  >
                    <BrainCircuit className="mt-0.5 size-4 shrink-0 text-[#6f86e8]" strokeWidth={1.6} />
                    <div className="min-w-0 flex-1">
                      <p className="font-jp text-[13px] leading-[1.7]">{m.text}</p>
                      <p className="mt-1 flex items-center gap-2 text-[10.5px] text-ink-muted">
                        <span className="tabular-nums">{m.date}</span>
                        <Badge variant={m.source === "agent" ? "default" : "lilac"} className="py-0 text-[9.5px]">
                          {m.source === "agent" ? "MIRAが学習" : "あなたが追加"}
                        </Badge>
                      </p>
                    </div>
                    <button onClick={() => dispatch({ t: "removeMemory", id: m.id })} aria-label="記憶を削除" className="grid size-8 place-items-center rounded-full text-ink-muted hover:bg-ink/5">
                      <Trash2 className="size-4" strokeWidth={1.5} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {tab === "reminders" && (
            <motion.div key="reminders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2.5">
              {state.reminders.length === 0 && <Empty text="「毎週日曜21時にマスクをリマインドして」のように頼むと、ここに追加されます。" />}
              {state.reminders.map((r) => (
                <div key={r.id} className="glass flex items-center gap-3 rounded-[22px] p-4">
                  <button
                    onClick={() => dispatch({ t: "toggleReminder", id: r.id })}
                    aria-label={r.done ? "未完了に戻す" : "完了にする"}
                    className={cn("grid size-7 shrink-0 place-items-center rounded-full border transition-colors", r.done ? "border-ink bg-ink text-white" : "border-ink/20")}
                  >
                    {r.done && <Check className="size-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-jp text-[13px]", r.done && "text-ink-muted line-through")}>{r.title}</p>
                    <p className="font-jp mt-0.5 flex items-center gap-1 text-[11px] text-ink-muted">
                      <Bell className="size-3" />
                      {r.when}
                    </p>
                  </div>
                  <button onClick={() => dispatch({ t: "removeReminder", id: r.id })} aria-label="リマインダーを削除" className="grid size-8 place-items-center rounded-full text-ink-muted hover:bg-ink/5">
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "log" && (
            <motion.div key="log" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              {days.length === 0 && <Empty text="まだ会話はありません。MIRA に話しかけてみてください。" />}
              {days.map(([day, msgs]) => (
                <section key={day}>
                  <p className="mb-2 px-1 text-[11px] tabular-nums tracking-[0.1em] text-ink-muted">{day}</p>
                  <div className="glass divide-y divide-ink/5 rounded-card">
                    {msgs.map((m) => (
                      <div key={m.id} className="flex gap-3 px-4 py-3">
                        <span className="w-10 shrink-0 pt-0.5 text-[10.5px] tabular-nums text-ink-muted">
                          {new Date(m.ts).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <p className={cn("font-jp min-w-0 flex-1 whitespace-pre-line text-[12.5px] leading-[1.75]", m.role === "user" ? "text-ink" : "text-ink-soft")}>
                          <span className="mr-1.5 text-[10px] tracking-[0.1em] text-ink-muted">{m.role === "user" ? (m.voice ? "あなた（音声）" : "あなた") : "MIRA"}</span>
                          {m.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
              {days.length > 0 && (
                <button onClick={() => confirm("会話ログをすべて削除しますか？") && dispatch({ t: "clearLog" })} className="font-jp mx-auto block text-[11.5px] text-[#c2415a]">
                  会話ログを削除
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="font-jp rounded-card border border-dashed border-ink/10 px-6 py-10 text-center text-[12px] leading-[1.8] text-ink-muted">{text}</p>;
}

/** Export in the same shape as the F.R.I.D.A.Y. Obsidian vault (記憶.md + 会話ログ). */
function download(state: AgentState) {
  const lines = ["# 記憶", "", ...state.memories.map((m) => `- ${m.text}（${m.date}）`), "", "# リマインダー", "", ...state.reminders.map((r) => `- [${r.done ? "x" : " "}] ${r.title} — ${r.when}`), "", "# 会話ログ", ""];
  let lastDay = "";
  for (const m of state.messages) {
    const d = new Date(m.ts);
    const day = d.toLocaleDateString("sv-SE");
    if (day !== lastDay) {
      lines.push(`## ${day}`, "");
      lastDay = day;
    }
    const time = d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
    if (m.role === "user") lines.push(`### ${time}${m.voice ? "（音声）" : ""}`, `**あなた**：${m.text}`, "");
    else lines.push(`> ${m.text.replace(/\n/g, "\n> ")}`, "");
  }
  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `MIRRA-brain-${new Date().toLocaleDateString("sv-SE")}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
}
