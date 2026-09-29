"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BrainCircuit, ChevronRight, CircleHelp, Crown, History, Link2, LogOut, PenLine, Settings, ShoppingBag, type LucideIcon } from "lucide-react";
import { MirraCard } from "@/components/card/mirra-card";
import { Wordmark } from "@/components/shell/logo";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Reveal } from "@/components/ui/motion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { user } from "@/lib/data";

type Row = { icon: LucideIcon; label: string; href?: string; trailing?: React.ReactNode };

export default function ProfilePage() {
  const [notify, setNotify] = useState(true);

  const groups: Row[][] = [
    [
      { icon: BrainCircuit, label: "AIエージェント（記憶・会話ログ）", href: "/ai/memory" },
      { icon: Settings, label: "アカウント設定" },
      { icon: History, label: "施術履歴", href: "/history" },
      { icon: ShoppingBag, label: "購入履歴", trailing: <span className="text-[11px] tabular-nums text-ink-muted">8件</span> },
    ],
    [
      { icon: Bell, label: "通知設定", trailing: <Switch checked={notify} onCheckedChange={setNotify} label="通知" /> },
      { icon: Link2, label: "サロン連携", trailing: <Badge variant="success">2件 連携中</Badge> },
      { icon: CircleHelp, label: "ヘルプ" },
    ],
  ];

  return (
    <main className="pb-36">
      <ScreenHeader eyebrow="MY PAGE" title="プロフィール" />

      <Reveal className="flex items-center gap-4 px-6">
        <div className="relative size-[72px] shrink-0 rounded-full bg-[conic-gradient(from_180deg,#b9c9ff,#f3d4ff,#c8f1ff,#b9c9ff)] p-[2.5px]">
          <div className="relative size-full overflow-hidden rounded-full ring-[3px] ring-canvas">
            <Image src={user.avatar} alt={user.name} fill sizes="72px" className="object-cover" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[19px] tracking-[0.06em]">{user.name}</p>
          <p className="mt-0.5 text-[11.5px] tabular-nums tracking-[0.12em] text-ink-muted">ID {user.memberId}</p>
          <Badge variant="ink" className="mt-2">
            <Crown className="size-3" />
            Premium Member
          </Badge>
        </div>
        <button aria-label="プロフィールを編集" className="glass grid size-10 place-items-center rounded-full">
          <PenLine className="size-[17px]" strokeWidth={1.5} />
        </button>
      </Reveal>

      {/* stats */}
      <Reveal className="mx-4 mt-6 grid grid-cols-3 gap-2">
        {[
          { v: user.stats.visits, l: "来店回数" },
          { v: user.stats.records, l: "カルテ" },
          { v: user.stats.points.toLocaleString(), l: "ポイント" },
        ].map((s) => (
          <div key={s.l} className="glass rounded-[22px] py-4 text-center">
            <p className="font-display text-[26px] font-light leading-none tabular-nums">{s.v}</p>
            <p className="font-jp mt-1.5 text-[10.5px] text-ink-muted">{s.l}</p>
          </div>
        ))}
      </Reveal>

      {/* membership */}
      <Reveal className="mx-4 mt-4">
        <div className="relative overflow-hidden rounded-card bg-[linear-gradient(135deg,#e6ecff,#f3eaff)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-ink/50">MEMBERSHIP</p>
              <p className="font-jp mt-1 text-[14px]">{user.plan.name}</p>
              <p className="mt-0.5 text-[11px] tabular-nums text-ink-soft">有効期限 {user.plan.expires}</p>
            </div>
            <button className="font-jp rounded-full bg-white/80 px-3.5 py-2 text-[11px] shadow-soft">プランを変更</button>
          </div>
          <Link href="/card" aria-label="MIRRA CARDを開く" className="mt-5 block">
            <motion.div whileHover={{ y: -4 }} className="mx-auto w-[88%]">
              <MirraCard flippable={false} float={false} />
            </motion.div>
          </Link>
        </div>
      </Reveal>

      <div className="mt-6 space-y-4 px-4">
        {groups.map((g, gi) => (
          <Reveal key={gi} className="glass overflow-hidden rounded-card">
            {g.map((row, i) => (
              <MenuRow key={row.label} row={row} divider={i > 0} />
            ))}
          </Reveal>
        ))}

        <Reveal>
          <button className="glass flex w-full items-center gap-3.5 rounded-card px-5 py-4 text-[#c2415a]">
            <span className="grid size-9 place-items-center rounded-[12px] bg-[#fdecef]">
              <LogOut className="size-[17px]" strokeWidth={1.5} />
            </span>
            <span className="font-jp text-[13.5px]">ログアウト</span>
          </button>
        </Reveal>
      </div>

      <div className="mt-12 flex flex-col items-center gap-2 text-ink/25">
        <Wordmark className="text-[16px]" />
        <p className="text-[10px] tracking-[0.2em]">Your Beauty, Always With You. · v1.0</p>
      </div>
    </main>
  );
}

function MenuRow({ row, divider }: { row: Row; divider: boolean }) {
  const inner = (
    <>
      <span className="grid size-9 place-items-center rounded-[12px] bg-[linear-gradient(135deg,#eef2ff,#f7efff)]">
        <row.icon className="size-[17px]" strokeWidth={1.5} />
      </span>
      <span className="font-jp flex-1 text-[13.5px]">{row.label}</span>
      {row.trailing}
      {!row.trailing || row.href ? <ChevronRight className="size-4 text-ink/25" /> : null}
    </>
  );
  const cls = "flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-white/50";
  const style = divider ? { borderTop: "1px solid rgba(16,24,40,0.05)" } : undefined;
  return row.href ? (
    <Link href={row.href} className={cls} style={style}>
      {inner}
    </Link>
  ) : (
    <div role="button" tabIndex={0} className={cls} style={style}>
      {inner}
    </div>
  );
}
