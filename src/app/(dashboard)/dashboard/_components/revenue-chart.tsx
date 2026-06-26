import { getUser } from "@/lib/auth/auth";
import { getRevenueChart } from "@/lib/data/dashboard";

import { RevenueChart } from "./revenue-chart.client";

interface RevenueChartServerProps {
  timezone?: string;
}

export async function RevenueChartServer({ timezone }: RevenueChartServerProps) {
  const { userId } = await getUser();
  const data = await getRevenueChart(userId, timezone);

  return <RevenueChart data={data} />;
}