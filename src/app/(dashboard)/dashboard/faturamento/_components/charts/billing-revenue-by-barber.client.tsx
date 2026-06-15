"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BillingRevenueByBarber } from "@/types/billing";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

interface BillingRevenueByBarberClientProps {
  data: BillingRevenueByBarber[];
}

export function BillingRevenueByBarberClient({ data }: BillingRevenueByBarberClientProps) {
  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por Barbeiro</CardTitle>
        <CardDescription>Total de agendamentos concluídos</CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState
            icon={BarChart3}
            title="Sem dados de receita"
            description="Quando houver agendamentos concluídos, a receita por barbeiro aparecerá aqui."
          />
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis dataKey="revenue" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4}>
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="revenue"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      {!isEmpty && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Baseado em agendamentos concluídos
          </div>
        </CardFooter>
      )}
    </Card>
  );
}