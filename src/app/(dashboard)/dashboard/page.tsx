import { Suspense } from "react";

import { ChartSkeleton } from "@/components/shared/skeletons/chart-skeleton";
import { RevenueChartSkeleton } from "@/components/shared/skeletons/revenue-chart-skeleton";
import { StatsSkeleton } from "@/components/shared/skeletons/stats-skeleton";

import { DashboardStatsCardsServer } from "./_components/dashboard-stats-cards";
import { RevenueChartServer } from "./_components/revenue-chart";
import { TopBarbersRevenueServer } from "./_components/top-barbers-revenue";
import { TopServicesServer } from "./_components/top-services";

interface DashboardPageProps {
  searchParams: Promise<{
    timezone?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { timezone } = await searchParams;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel.</p>
      </div>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStatsCardsServer timezone={timezone} />
      </Suspense>
      <Suspense fallback={<RevenueChartSkeleton />}>
        <RevenueChartServer timezone={timezone} />
      </Suspense>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <TopBarbersRevenueServer />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <TopServicesServer />
        </Suspense>
      </div>
    </div>
  );
}