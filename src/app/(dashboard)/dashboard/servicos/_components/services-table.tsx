import { getUser } from "@/lib/auth/auth";
import { getServicesTable } from "@/lib/data/services";
import { ServicesTableClient } from "./services-table.client";

interface ServicesTableServerProps {
  page?: number;
  search?: string;
  active?: boolean;
}

export async function ServicesTableServer({
  page,
  search,
  active,
}: ServicesTableServerProps) {
  const { userId } = await getUser();

  const data = await getServicesTable(userId, { page, search, active });

  return <ServicesTableClient data={data} />;
}