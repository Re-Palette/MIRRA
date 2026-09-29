"use client";

import { motion } from "framer-motion";
import { Bell, BookmarkCheck, BrainCircuit, CalendarCheck, CalendarX, Check, Compass, ShoppingBag, Sparkles, Trash2, X, type LucideIcon } from "lucide-react";
import { screens } from "@/lib/agent/catalog";
import type { ActionStatus, AgentAction } from "@/lib/agent/types";
import { products, salons } from "@/lib/data";
import { ProductVisual } from "@/components/ui/product-visual";
import { cn, yen } from "@/lib/utils";

function describe(a: AgentAction): { icon: LucideIcon; label: string; detail?: string } | null {
  switch (a.type) {
    case "remember":
      return { icon: BrainCircuit, label: "記憶しました", detail: a.text };
    case "forget":
      return { icon: Trash2, label: "記憶を削除しました" };
    case "add_to_cart": {
      const p = products.find((x) => x.id === a.productId);
      return { icon: ShoppingBag, label: "カートに追加", detail: p ? `${p.name} ${yen(p.price)}` : a.productId };
    }
    case "set_reminder":
      return { icon: Bell, label: "リマインダーを設定", detail: `${a.title} · ${a.when}` };
    case "navigate":
      return { icon: Compass, label: "画面を開きました", detail: screens[a.to] ?? a.to };
    case "book_salon": {
      const s = salons.find((x) => x.id === a.salonId);
      return { icon: CalendarCheck, label: "予約の確定", detail: `${s ? `${s.name} ${s.area}` : a.salonId} · ${a.date} ${a.time} · ${a.menu}` };
    }
    case "cancel_reservation":
      return { icon: CalendarX, label: "予約のキャンセル" };
    default:
      return null;
  }
}

export function ActionCard({
  action,
  status,
  onResolve,
  dark,
}: {
  action: AgentAction;
  status: ActionStatus;
  onResolve?: (approve: boolean) => void;
  dark?: boolean;
}) {
  if (action.type === "show_products") return <ProductStrip ids={action.productIds} />;
  if (action.type === "show_plan") return <PlanCard title={action.title} steps={action.steps} />;

  const d = describe(action);
  if (!d) return null;
  const Icon = d.icon;
  const pending = status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "mt-2 overflow-hidden rounded-[20px] border",
        dark ? "border-white/10 bg-white/[0.06] text-white" : pending ? "border-[#c9d4ff] bg-white" : "border-white/60 bg-white/70",
        pending && !dark && "shadow-[0_10px_30px_-12px_rgba(79,99,217,0.45)]",
      )}
    >
      <div className="flex items-center gap-3 px-3.5 py-3">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full",
            status === "declined" ? "bg-ink/5 text-ink-muted" : pending ? "bg-ink text-white" : dark ? "bg-white/10" : "bg-[linear-gradient(135deg,#dde8ff,#f6e8ff)]",
          )}
        >
          <Icon className="size-[17px]" strokeWidth={1.6} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className={cn("font-jp text-[12.5px]", status === "declined" && "text-ink-muted line-through")}>{d.label}</p>
          {d.detail && <p className={cn("font-jp mt-0.5 truncate text-[11px]", dark ? "text-white/55" : "text-ink-muted")}>{d.detail}</p>}
        </div>
        {status === "done" && (
          <span className="flex items-center gap-1 text-[10.5px] text-[#1f7a4d]">
            <BookmarkCheck className="size-3.5" />
            完了
          </span>
        )}
        {status === "declined" && <span className="text-[10.5px] text-ink-muted">見送り</span>}
      </div>
      {pending && onResolve && (
        <div className="grid grid-cols-2 gap-2 border-t border-ink/5 p-2">
          <button onClick={() => onResolve(false)} className="font-jp flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink/5 text-[12px] text-ink-soft">
            <X className="size-3.5" />
            やめる
          </button>
          <button onClick={() => onResolve(true)} className="font-jp flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink text-[12px] text-white shadow-glow">
            <Check className="size-3.5" />
            承認する
          </button>
        </div>
      )}
    </motion.div>
  );
}

function ProductStrip({ ids }: { ids: string[] }) {
  const list = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => !!p);
  if (!list.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="no-scrollbar -mr-5 mt-2.5 flex gap-2.5 overflow-x-auto pr-5">
      {list.map((p) => (
        <div key={p.id} className="glass w-[132px] shrink-0 rounded-[20px] p-2">
          <div className="relative aspect-square overflow-hidden rounded-[14px]">
            <ProductVisual kind={p.kind} />
          </div>
          <p className="font-jp mt-2 truncate px-1 text-[11.5px]">{p.name}</p>
          <div className="flex items-center justify-between px-1 pb-0.5 pt-1">
            <span className="text-[12px] tabular-nums">{yen(p.price)}</span>
            <span className="text-[10px] text-[#6a4a86]">{p.match}%</span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function PlanCard({ title, steps }: { title: string; steps: { title: string; detail: string }[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-2.5 rounded-[22px] p-4">
      <p className="font-jp flex items-center gap-1.5 text-[12px] font-medium">
        <Sparkles className="size-3.5 text-[#8b7bff]" />
        {title}
      </p>
      <ol className="mt-3 space-y-2.5">
        {steps.map((p, i) => (
          <motion.li key={p.title + i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="flex items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#dde8ff,#f6e8ff)] text-[12px] tabular-nums">{i + 1}</span>
            <div className="leading-tight">
              <p className="font-jp text-[12.5px]">{p.title}</p>
              <p className="font-jp mt-0.5 text-[10.5px] text-ink-muted">{p.detail}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
