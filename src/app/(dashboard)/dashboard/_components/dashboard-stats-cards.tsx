import { getUser } from "@/lib/auth/auth";
import { getDashboardStats } from "@/lib/data/dashboard";
import { DashboardStatsCards } from "./dashboard-stats-cards.client";

export async function DashboardStatsCardsServer() {
  const { userId } = await getUser();
  const data = await getDashboardStats(userId);

  return <DashboardStatsCards data={data} />;
}