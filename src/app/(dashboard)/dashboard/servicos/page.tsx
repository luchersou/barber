import { Suspense } from "react";

import { ServicesNewButton } from "./_components/services-new-button.client";
import { ServicesTableServer } from "./_components/services-table";

interface ServicesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    active?: string;
  }>;
}

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const { page, search, active } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços da barbearia.
          </p>
        </div>
        <ServicesNewButton />
      </div>
      <Suspense fallback={<div>Carregando...</div>}>
        <ServicesTableServer
          page={page ? Number(page) : undefined}
          search={search}
          active={active !== undefined ? active === "true" : undefined}
        />
      </Suspense>
    </div>
  );
}