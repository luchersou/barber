import { getUser } from "@/lib/auth/auth";
import { getAppointmentsByStatus } from "@/lib/data/dashboard";
import { AppointmentsByStatusChart } from "./appointments-by-status.client";

export async function AppointmentsByStatusServer() {
  const { userId } = await getUser();
  const data = await getAppointmentsByStatus(userId);

  return <AppointmentsByStatusChart data={data} />;
}