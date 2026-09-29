import { HomeHero } from "@/components/home/home-hero";
import { ScoreCard } from "@/components/home/score-card";
import { AgentBriefCard, HistoryPreview, ProductRail, ReservationCard } from "@/components/home/home-sections";

export default function HomePage() {
  return (
    <main className="pb-36">
      <HomeHero />
      <ScoreCard />
      <div className="mt-5 space-y-9">
        <AgentBriefCard />
        <ProductRail />
        <ReservationCard />
        <HistoryPreview />
      </div>
    </main>
  );
}
