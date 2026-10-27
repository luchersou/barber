import { getUser } from "@/lib/auth/auth";
import { getClients } from "@/lib/data/clients";

import { ClientsTableClient } from "./clients-table.client";

interface ClientsTableServerProps {
  page?: number;
  search?: string;
  active?: boolean;
}

export async function ClientsTableServer({
  page,
  search,
  active,
}: ClientsTableServerProps) {
  const { userId } = await getUser();

  const data = await getClients(userId, { page, search, active });

  const hasFilters = Boolean(search || active !== undefined);

  return <ClientsTableClient data={data} hasFilters={hasFilters} />;
}