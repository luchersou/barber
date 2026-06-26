import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/shared/skeletons/table-skeleton";
import { AppointmentsTableServer } from "./_components/appointments-table";
import { AppointmentsNewButtonServer } from "./_components/appointments-new-button";

interface AppointmentsPageProps {
  searchParams: Promise<{
    page?: string;
    barberId?: string;
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const { page, barberId, clientId, startDate, endDate } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Atendimentos</h1>
          <p className="text-muted-foreground">
            Gerencie os atendimentos da barbearia.
          </p>
        </div>
        <Suspense
          fallback={
            <Button disabled>
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Atendimento
            </Button>
          }
        >
          <AppointmentsNewButtonServer />
        </Suspense>
      </div>
      <Suspense fallback={<TableSkeleton cols={7} />}>
        <AppointmentsTableServer
          page={page ? Number(page) : undefined}
          barberId={barberId}
          clientId={clientId}
          startDate={startDate}
          endDate={endDate}
        />
      </Suspense>
    </div>
  );
}