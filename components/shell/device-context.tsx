"use client";

import { createContext, useContext, useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

type DeviceContextValue = {
  scrollRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
};

export const DeviceContext = createContext<DeviceContextValue | null>(null);

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be used inside <AppShell>");
  return ctx;
}

/** Renders children into the device's overlay layer so sheets stay inside the phone frame. */
export function DeviceOverlay({ children }: { children: React.ReactNode }) {
  const { overlayRef } = useDevice();
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => setEl(overlayRef.current), [overlayRef]);
  if (!el) return null;
  return createPortal(children, el);
}
