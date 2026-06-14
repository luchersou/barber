import { getUser } from "@/lib/auth/auth";
import { getBillingRevenueChart } from "@/lib/data/billing";
import { BillingRevenueChartClient } from "./billing-revenue-chart.client";

export async function BillingRevenueChartServer() {
  const { userId } = await getUser();
  const data = await getBillingRevenueChart(userId);

  return <BillingRevenueChartClient data={data} />;
}