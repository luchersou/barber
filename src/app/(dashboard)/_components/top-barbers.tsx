import { getUser } from "@/lib/auth/auth";
import { getTopBarbers } from "@/lib/data/dashboard";
import { TopBarbersChart } from "./top-barbers.client";

export async function TopBarbersServer() {
  const { userId } = await getUser();
  const data = await getTopBarbers(userId);

  return <TopBarbersChart data={data} />;
}