import { getUser } from "@/lib/auth/auth";
import { getClientsForSelect } from "@/lib/data/clients";
import { getBarbersForSelect } from "@/lib/data/barbers";
import { getServicesForSelect } from "@/lib/data/services";
import { AppointmentsNewButton } from "./appointments-new-button.client";

export async function AppointmentsNewButtonServer() {
  const { userId } = await getUser();

  const [clients, barbers, services] = await Promise.all([
    getClientsForSelect(userId),
    getBarbersForSelect(userId),
    getServicesForSelect(userId),
  ]);

  return (
    <AppointmentsNewButton
      clients={clients}
      barbers={barbers}
      services={services}
    />
  );
}