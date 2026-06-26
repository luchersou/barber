import { getUser } from "@/lib/auth/auth";
import { getBillingRevenueByService } from "@/lib/data/billing";

import { BillingRevenueByServiceClient } from "./billing-revenue-by-service.client";

export async function BillingRevenueByServiceServer() {
  const { userId } = await getUser();
  const data = await getBillingRevenueByService(userId);

  return <BillingRevenueByServiceClient data={data} />;
}