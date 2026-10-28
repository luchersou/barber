import type { Metadata } from "next";
import { Suspense } from "react";

import { ChartSkeleton } from "@/components/shared/skeletons/chart-skeleton";
import { RevenueChartSkeleton } from "@/components/shared/skeletons/revenue-chart-skeleton";
import { StatsSkeleton } from "@/components/shared/skeletons/stats-skeleton";

import { DashboardStatsCardsServer } from "./_components/dashboard-stats-cards";
import { RevenueChartServer } from "./_components/revenue-chart";
import { TopBarbersRevenueServer } from "./_components/top-barbers-revenue";
import { TopServicesServer } from "./_components/top-services";

export const metadata: Metadata = {
  title: "Início",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel.</p>
      </div>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStatsCardsServer />
      </Suspense>
      <Suspense fallback={<RevenueChartSkeleton />}>
        <RevenueChartServer />
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