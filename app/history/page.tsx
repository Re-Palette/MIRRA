import { HistoryView } from "@/components/history/history-view";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return <HistoryView initialTab={tab === "data" ? "data" : "records"} />;
}
