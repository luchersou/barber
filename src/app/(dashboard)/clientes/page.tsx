import { Suspense } from "react";
import { ClientsTableServer } from "./_components/clients-table";
import { ClientsNewButton } from "./_components/clients-new-button.client";

interface ClientsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function ClientsPage({
  searchParams,
}: ClientsPageProps) {
  const { page, search } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da barbearia.
          </p>
        </div>
        <ClientsNewButton />
      </div>
      <Suspense fallback={<div>Carregando...</div>}>
        <ClientsTableServer
          page={page ? Number(page) : undefined}
          search={search}
        />
      </Suspense>
    </div>
  );
}