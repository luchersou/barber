import { getUser } from "@/lib/auth/auth";
import { getBillingTransactions } from "@/lib/data/billing";
import { BillingTransactionsClient } from "./billing-transactions.client";

interface BillingTransactionsServerProps {
  page?: number;
  startDate?: string;
  endDate?: string;
  timezone?: string;
}

export async function BillingTransactionsServer({
  page,
  startDate,
  endDate,
  timezone,
}: BillingTransactionsServerProps) {
  const { userId } = await getUser();

  const data = await getBillingTransactions(userId, { page, startDate, endDate, timezone  });

  const hasFilters = Boolean(startDate || endDate);

  return <BillingTransactionsClient data={data} hasFilters={hasFilters} />;
}