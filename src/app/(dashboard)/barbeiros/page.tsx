import { Suspense } from "react";
import { BarbersTableServer } from "./_components/barbers-table";
import { BarbersNewButton } from "./_components/barbers-new-button.client";

interface BarbersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    active?: string;
  }>;
}

export default async function BarbersPage({
  searchParams,
}: BarbersPageProps) {
  const { page, search, active } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Barbeiros</h1>
          <p className="text-muted-foreground">
            Gerencie os barbeiros da barbearia.
          </p>
        </div>
        <BarbersNewButton />
      </div>
      <Suspense fallback={<div>Carregando...</div>}>
        <BarbersTableServer
          page={page ? Number(page) : undefined}
          search={search}
          active={active !== undefined ? active === "true" : undefined}
        />
      </Suspense>
    </div>
  );
}