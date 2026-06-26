"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BillingRevenueChart } from "@/types/billing";

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface BillingRevenueChartClientProps {
  data: BillingRevenueChart[];
}

export function BillingRevenueChartClient({ data }: BillingRevenueChartClientProps) {
  const isEmpty = data.every((d) => d.revenue === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState
            icon={TrendingUp}
            title="Sem dados de receita"
            description="O histórico de receita dos últimos 12 meses aparecerá aqui conforme os atendimentos forem concluídos."
          />
        ) : (
          <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      {!isEmpty && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Apenas agendamentos concluídos
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}