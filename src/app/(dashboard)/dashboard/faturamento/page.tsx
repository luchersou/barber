import { Suspense } from "react";
import { StatsSkeleton } from "@/components/shared/skeletons/stats-skeleton";
import { ChartSkeleton } from "@/components/shared/skeletons/chart-skeleton";
import { RevenueChartSkeleton } from "@/components/shared/skeletons/revenue-chart-skeleton";
import { TableSkeleton } from "@/components/shared/skeletons/table-skeleton";
import { BillingStatsServer } from "./_components/stats/billing-stats";
import { BillingRevenueChartServer } from "./_components/charts/billing-revenue-chart";
import { BillingRevenueByBarberServer } from "./_components/charts/billing-revenue-by-barber";
import { BillingRevenueByServiceServer } from "./_components/charts/billing-revenue-by-service";
import { BillingTransactionsServer } from "./_components/transactions/billing-transactions";

interface BillingPageProps {
  searchParams: Promise<{
    page?: string;
    startDate?: string;
    endDate?: string;
    timezone?: string;
  }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const { page, startDate, endDate, timezone } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Faturamento</h1>
        <p className="text-muted-foreground">
          Métricas de receita e relatórios.
        </p>
      </div>
      <Suspense fallback={<StatsSkeleton />}>
        <BillingStatsServer />
      </Suspense>
      <Suspense fallback={<RevenueChartSkeleton />}>
        <BillingRevenueChartServer />
      </Suspense>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <BillingRevenueByBarberServer />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <BillingRevenueByServiceServer />
        </Suspense>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <BillingTransactionsServer
          page={page ? Number(page) : undefined}
          startDate={startDate}
          endDate={endDate}
          timezone={timezone}
        />
      </Suspense>
    </div>
  );
}