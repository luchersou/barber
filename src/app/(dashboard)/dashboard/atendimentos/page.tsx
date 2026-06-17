import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/skeletons/table-skeleton";
import { AppointmentsTableServer } from "./_components/appointments-table";

interface AppointmentsPageProps {
  searchParams: Promise<{
    page?: string;
    barberId?: string;
    clientId?: string;
    startDate?: string;
    endDate?: string;
    timezone?: string;
  }>;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const { page, barberId, clientId, startDate, endDate, timezone } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Atendimentos</h1>
        <p className="text-muted-foreground">
          Gerencie os atendimentos da barbearia.
        </p>
      </div>
      <Suspense fallback={<TableSkeleton cols={7} />}>
        <AppointmentsTableServer
          page={page ? Number(page) : undefined}
          barberId={barberId}
          clientId={clientId}
          startDate={startDate}
          endDate={endDate}
          timezone={timezone}
        />
      </Suspense>
    </div>
  );
}