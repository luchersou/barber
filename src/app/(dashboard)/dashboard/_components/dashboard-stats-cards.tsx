import { getUser } from "@/lib/auth/auth";
import { getDashboardStats } from "@/lib/data/dashboard";

import { DashboardStatsCards } from "./dashboard-stats-cards.client";

interface DashboardStatsCardsServerProps {
  timezone?: string;
}

export async function DashboardStatsCardsServer({ timezone }: DashboardStatsCardsServerProps) {
  const { userId } = await getUser();
  const data = await getDashboardStats(userId, timezone);

  return <DashboardStatsCards data={data} />;
}