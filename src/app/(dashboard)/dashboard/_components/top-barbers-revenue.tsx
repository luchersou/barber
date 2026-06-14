import { getUser } from "@/lib/auth/auth";
import { getTopBarbersByRevenue } from "@/lib/data/dashboard";
import { TopBarbersRevenueChart } from "./top-barbers-revenue.client";

export async function TopBarbersRevenueServer() {
  const { userId } = await getUser();
  const data = await getTopBarbersByRevenue(userId);

  return <TopBarbersRevenueChart data={data} />;
}