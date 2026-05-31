import { getUser } from "@/lib/auth/auth";
import { getRevenueChart } from "@/lib/data/dashboard";
import { RevenueChart } from "./revenue-chart.client";

export async function RevenueChartServer() {
  const { userId } = await getUser();
  const data = await getRevenueChart(userId);

  return <RevenueChart data={data} />;
}