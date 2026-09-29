import { BeautyIdCard } from "@/components/home/beauty-id-card";
import { AiConcierge, BeautyScore, BeautyTimeline, NextAppointment, Recommended, WeatherHeader } from "@/components/home/home-v2";

export default function HomePage() {
  return (
    <main className="relative pb-36">
      {/* barely-there morning haze behind the header and card */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(120%_70%_at_50%_0%,#e9edfb_0%,rgba(247,248,250,0)_70%)]" />
      <div className="relative">
        <WeatherHeader />
        <BeautyIdCard />
        <div className="mt-7 space-y-8">
          <BeautyScore />
          <AiConcierge />
          <BeautyTimeline />
          <NextAppointment />
          <Recommended />
        </div>
      </div>
    </main>
  );
}
