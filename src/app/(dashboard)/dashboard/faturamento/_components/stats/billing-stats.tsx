import { getUser } from "@/lib/auth/auth";
import { getBillingStats } from "@/lib/data/billing";
import { BillingStatsCards } from "./billing-stats.client";

export async function BillingStatsServer() {
  const { userId } = await getUser();
  const data = await getBillingStats(userId);

  return <BillingStatsCards data={data} />;
}