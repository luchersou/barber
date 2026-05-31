import { getUser } from "@/lib/auth/auth";
import { getDashboardStats } from "@/lib/data/dashboard";
import { SummaryCards } from "./summary-cards.client";

export async function SummaryCardsServer() {
  const { userId } = await getUser();
  const data = await getDashboardStats(userId);

  return <SummaryCards data={data} />;
}