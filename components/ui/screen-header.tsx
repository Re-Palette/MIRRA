import { cn } from "@/lib/utils";

export function ScreenHeader({
  eyebrow,
  title,
  action,
  className,
  dark,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <header className={cn("flex items-end justify-between px-6 pb-5 pt-[max(env(safe-area-inset-top),20px)] lg:pt-[68px]", className)}>
      <div>
        {eyebrow && (
          <p className={cn("mb-1.5 text-[10.5px] tracking-[0.34em]", dark ? "text-white/45" : "text-ink-muted")}>{eyebrow}</p>
        )}
        <h1 className={cn("font-jp text-[24px] font-normal tracking-[0.06em]", dark ? "text-white" : "text-ink")}>{title}</h1>
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ title, en, action }: { title: string; en?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between px-6">
      <div>
        {en && <p className="mb-1 text-[10px] tracking-[0.3em] text-ink-muted">{en}</p>}
        <h2 className="font-jp text-[16px] font-medium tracking-[0.06em]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
