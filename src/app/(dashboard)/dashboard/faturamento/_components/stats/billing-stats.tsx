import { getUser } from "@/lib/auth/auth";
import { getBillingStats } from "@/lib/data/billing";
import { BillingStatsCards } from "./billing-stats.client";

interface BillingStatsServerProps {
  timezone?: string;
}

export async function BillingStatsServer({ timezone }: BillingStatsServerProps) {
  const { userId } = await getUser();
  const data = await getBillingStats(userId, timezone);

  return <BillingStatsCards data={data} />;
}