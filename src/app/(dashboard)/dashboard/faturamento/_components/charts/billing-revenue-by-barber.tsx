import { getUser } from "@/lib/auth/auth";
import { getBillingRevenueByBarber } from "@/lib/data/billing";
import { BillingRevenueByBarberClient } from "./billing-revenue-by-barber.client";

export async function BillingRevenueByBarberServer() {
  const { userId } = await getUser();
  const data = await getBillingRevenueByBarber(userId);

  return <BillingRevenueByBarberClient data={data} />;
}