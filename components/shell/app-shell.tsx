"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { DeviceContext } from "./device-context";
import { BottomNav } from "./bottom-nav";
import { StatusBar } from "./status-bar";
import { BrandPanel } from "./brand-panel";
import { cn } from "@/lib/utils";
import { AgentProvider } from "@/components/agent/agent-provider";
import { VoiceOverlay } from "@/components/agent/voice-overlay";

const DARK_ROUTES = ["/card"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dark = DARK_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 34 }}>
      <DeviceContext.Provider value={{ scrollRef, overlayRef }}>
        <AgentProvider>
        <div className="relative min-h-dvh overflow-hidden lg:flex lg:items-center lg:justify-center lg:gap-14 lg:p-8">
          <Backdrop />
          <BrandPanel />

          {/* Device */}
          <div
            className={cn(
              "relative isolate h-dvh w-full overflow-hidden transition-colors duration-700",
              "lg:h-[874px] lg:w-[402px] lg:shrink-0 lg:rounded-[62px] lg:shadow-[0_0_0_11px_#0c0e14,0_0_0_12.5px_#3a3d46,0_60px_120px_-30px_rgba(16,24,40,0.45)]",
              dark ? "bg-night" : "bg-canvas",
            )}
          >
            <StatusBar dark={dark} />
            <div ref={scrollRef} className="no-scrollbar relative h-full overflow-x-hidden overflow-y-auto overscroll-contain">
              {children}
            </div>
            <BottomNav dark={dark} />
            <VoiceOverlay />
            <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-50 [&>*]:pointer-events-auto" />
            {/* Home indicator */}
            <div
              className={cn(
                "pointer-events-none absolute bottom-2 left-1/2 z-[60] hidden h-[5px] w-[134px] -translate-x-1/2 rounded-full lg:block",
                dark ? "bg-white/80" : "bg-ink/85",
              )}
            />
          </div>
        </div>
        </AgentProvider>
      </DeviceContext.Provider>
    </MotionConfig>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden bg-[#eef1f7] lg:block">
      <div className="animate-drift absolute -left-[10%] -top-[20%] h-[70vh] w-[60vw] rounded-full bg-[#dde8ff] blur-[120px]" />
      <div className="animate-drift absolute -right-[10%] top-[10%] h-[60vh] w-[50vw] rounded-full bg-[#f6e8ff] blur-[120px] [animation-delay:-6s]" />
      <div className="animate-drift absolute bottom-[-25%] left-[30%] h-[60vh] w-[50vw] rounded-full bg-[#e6f4ff] blur-[120px] [animation-delay:-12s]" />
      <div className="grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
