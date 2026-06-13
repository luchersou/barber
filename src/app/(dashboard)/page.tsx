import { Suspense } from "react";
import { SummaryCardsServer } from "./_components/summary-cards";
import { RevenueChartServer } from "./_components/revenue-chart";
import { AppointmentsByStatusServer } from "./_components/appointments-by-status";
import { TopServicesServer } from "./_components/top-services";
import { TopBarbersRevenueServer } from "./_components/top-barbers-revenue";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel.</p>
      </div>
      <Suspense fallback={<div>Carregando...</div>}>
        <SummaryCardsServer />
      </Suspense>
      <Suspense fallback={<div>Carregando...</div>}>
        <RevenueChartServer />
      </Suspense>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Suspense fallback={<div>Carregando...</div>}>
          <TopBarbersRevenueServer />
        </Suspense>
        <Suspense fallback={<div>Carregando...</div>}>
          <TopServicesServer />
        </Suspense>
      </div>
    </div>
  );
}