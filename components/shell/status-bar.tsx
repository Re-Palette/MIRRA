import { cn } from "@/lib/utils";

/** iOS-style status bar + Dynamic Island. Only visible inside the desktop device frame. */
export function StatusBar({ dark }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-[60] hidden h-[54px] items-center justify-between px-[34px] pt-1 text-[15px] font-medium lg:flex",
        dark ? "text-white" : "text-ink",
      )}
    >
      <span className="w-14 tabular-nums">9:41</span>
      <div className="absolute left-1/2 top-[11px] h-[35px] w-[124px] -translate-x-1/2 rounded-full bg-black" />
      <div className="flex w-14 items-center justify-end gap-[6px]">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="6" rx="1" />
          <rect x="10" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="15" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
          <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1-1.1A10 10 0 0 0 8 .6 10 10 0 0 0 1 3.5l1 1.1a8.6 8.6 0 0 1 6-2.4Zm0 3.2c1.4 0 2.7.5 3.7 1.4l1-1.1A7 7 0 0 0 8 3.8a7 7 0 0 0-4.7 1.9l1 1.1c1-.9 2.3-1.4 3.7-1.4Zm0 3.2c.6 0 1.1.2 1.5.6L8 10.8 6.5 9.2c.4-.4.9-.6 1.5-.6Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.45" />
        </svg>
      </div>
    </div>
  );
}
