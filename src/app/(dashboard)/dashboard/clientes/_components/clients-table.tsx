import { getUser } from "@/lib/auth/auth";
import { getClients } from "@/lib/data/clients";
import { ClientsTableClient } from "./clients-table.client";

interface ClientsTableServerProps {
  page?: number;
  search?: string;
}

export async function ClientsTableServer({
  page,
  search,
}: ClientsTableServerProps) {
  const { userId } = await getUser();

  const data = await getClients(userId, { page, search });

  return <ClientsTableClient data={data} />;
}