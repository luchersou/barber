import { getUser } from "@/lib/auth/auth";
import { getTopServices } from "@/lib/data/dashboard";
import { TopServicesChart } from "./top-services.client";

export async function TopServicesServer() {
  const { userId } = await getUser();
  const data = await getTopServices(userId);

  return <TopServicesChart data={data} />;
}