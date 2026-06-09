import { getUser } from "@/lib/auth/auth";
import { getBarbersTable } from "@/lib/data/barbers";
import { BarbersTableClient } from "./barbers-table.client";

interface BarbersTableServerProps {
  page?: number;
  search?: string;
  active?: boolean;
}

export async function BarbersTableServer({
  page,
  search,
  active,
}: BarbersTableServerProps) {
  const { userId } = await getUser();

  const data = await getBarbersTable(userId, { page, search, active });

  return <BarbersTableClient data={data} />;
}