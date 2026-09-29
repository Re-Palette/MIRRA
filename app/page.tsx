import { HomeHero } from "@/components/home/home-hero";
import { ScoreCard } from "@/components/home/score-card";
import { AdviceCard, HistoryPreview, ProductRail, ReservationCard } from "@/components/home/home-sections";

export default function HomePage() {
  return (
    <main className="pb-36">
      <HomeHero />
      <ScoreCard />
      <div className="mt-5 space-y-9">
        <AdviceCard />
        <ProductRail />
        <ReservationCard />
        <HistoryPreview />
      </div>
    </main>
  );
}
