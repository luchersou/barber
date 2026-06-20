import { getUser } from "@/lib/auth/auth";
import { getBillingRevenueChart } from "@/lib/data/billing";
import { BillingRevenueChartClient } from "./billing-revenue-chart.client";

interface BillingRevenueChartServerProps {
  timezone?: string;
}

export async function BillingRevenueChartServer({ timezone }: BillingRevenueChartServerProps) {
  const { userId } = await getUser();
  const data = await getBillingRevenueChart(userId, timezone);

  return <BillingRevenueChartClient data={data} />;
}