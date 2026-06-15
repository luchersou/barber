import { getUser } from "@/lib/auth/auth";
import { getAppointments } from "@/lib/data/appointments";
import { getBarbersForSelect } from "@/lib/data/barbers";
import { getClientsForSelect } from "@/lib/data/clients";
import { AppointmentsTableClient } from "./appointments-table.client";

interface AppointmentsTableServerProps {
  page?: number;
  barberId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export async function AppointmentsTableServer({
  page,
  barberId,
  clientId,
  startDate,
  endDate,
}: AppointmentsTableServerProps) {
  const { userId } = await getUser();

  const [data, barbers, clients] = await Promise.all([
    getAppointments(userId, { page, barberId, clientId, startDate, endDate }),
    getBarbersForSelect(userId),
    getClientsForSelect(userId),
  ]);

  const hasFilters = Boolean(barberId || clientId || startDate || endDate);

  return (
    <AppointmentsTableClient
      data={data}
      barbers={barbers}
      clients={clients}
      hasFilters={hasFilters}
    />
  );
}